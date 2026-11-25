import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import {
  AESTHETIC_PRESETS,
  type AestheticPresetKey,
  MODEL_SHOWCASE_INFO,
  type ModelKey,
} from '../data/cafeData';
import {
  buildCortadoModel,
  buildCounterPedestal,
  buildCroissantModel,
  buildPortafilterModel,
  buildPourOverModel,
  createCafeMaterials,
} from '../three/cafeModels';
import { createContactShadowTexture } from '../three/proceduralTextures';

interface CafeStage3DProps {
  activeModel: ModelKey;
  onSelectModel: (model: ModelKey) => void;
  aesthetic: AestheticPresetKey;
  onSelectAesthetic: (preset: AestheticPresetKey) => void;
  onOrderModel: (menuId: string) => void;
}

type CameraPresetKey = 'hero' | 'top' | 'closeup';

const CAMERA_PRESETS: Record<
  CameraPresetKey,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  hero: { pos: [3.2, 2.25, 3.65], target: [0, 0.58, 0] },
  top: { pos: [0.25, 4.45, 1.35], target: [0, 0.42, 0] },
  closeup: { pos: [1.85, 1.28, 2.1], target: [0, 0.56, 0] },
};

// Module-scope reusable math helpers (zero GC inside animation loop)
const _camGoalPos = new THREE.Vector3();
const _camGoalTarget = new THREE.Vector3();
const _bgTargetColor = new THREE.Color();
const _keyTargetColor = new THREE.Color();
const _skyTargetColor = new THREE.Color();
const _groundTargetColor = new THREE.Color();
const _rimTargetColor = new THREE.Color();

export function CafeStage3D({
  activeModel,
  onSelectModel,
  aesthetic,
  onSelectAesthetic,
  onOrderModel,
}: CafeStage3DProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [explodeAmount, setExplodeAmount] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPresetKey>('hero');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  // Mutable refs read inside the stable WebGL loop so UI updates never tear down the canvas
  const stateRef = useRef({
    activeModel,
    aesthetic,
    explodeAmount: 0,
    cameraPreset: 'hero' as CameraPresetKey,
    cameraTransitionActive: false,
    triggerReset: false,
  });

  useEffect(() => {
    stateRef.current.activeModel = activeModel;
  }, [activeModel]);

  useEffect(() => {
    stateRef.current.aesthetic = aesthetic;
  }, [aesthetic]);

  useEffect(() => {
    stateRef.current.explodeAmount = explodeAmount;
  }, [explodeAmount]);

  const handleCameraPreset = (preset: CameraPresetKey) => {
    setCameraPreset(preset);
    stateRef.current.cameraPreset = preset;
    stateRef.current.cameraTransitionActive = true;
  };

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // Detect software WebGL (SwiftShader, llvmpipe, WARP) purely from renderer string
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    const handleContextRestored = () => {
      setWebglFailed(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const initialPreset = AESTHETIC_PRESETS[stateRef.current.aesthetic];
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(initialPreset.bgHex);
    scene.fog = new THREE.FogExp2(initialPreset.fogHex, 0.052);

    // Mandatory studio environment reflection via RoomEnvironment on all devices
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    camera.position.set(...CAMERA_PRESETS.hero.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.hero.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 1.85;
    controls.maxDistance = 6.8;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minPolarAngle = 0.16;
    controls.autoRotate = !isSoftwareGl;
    controls.autoRotateSpeed = 0.55;

    // Cancel scripted camera transitions immediately when user drags
    controls.addEventListener('start', () => {
      stateRef.current.cameraTransitionActive = false;
    });

    // Balanced 3-Point Studio Lighting Rig (warm key + cool hemi fill + rim)
    const keyLight = new THREE.DirectionalLight(initialPreset.keyLightHex, initialPreset.keyIntensity);
    keyLight.position.set(4.5, 6.2, 3.8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.2;
    keyLight.shadow.camera.right = 3.2;
    keyLight.shadow.camera.top = 3.2;
    keyLight.shadow.camera.bottom = -3.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(
      initialPreset.hemiSkyHex,
      initialPreset.hemiGroundHex,
      initialPreset.hemiIntensity,
    );
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(initialPreset.rimLightHex, initialPreset.rimIntensity);
    rimLight.position.set(-4.2, 3.6, -3.8);
    scene.add(rimLight);

    // Optional studio softbox for crisp elongated brass & glass bevel highlights on hardware GPUs
    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softbox = new THREE.RectAreaLight(0xfff5e4, 2.4, 3.8, 1.8);
      softbox.position.set(2.8, 3.4, -2.2);
      softbox.lookAt(0, 0.5, 0);
      scene.add(softbox);
    }

    // Build materials & composite cafe models
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const mats = createCafeMaterials(maxAnisotropy, isSoftwareGl);

    // Architectural fluted counter pedestal
    const { group: pedestalGroup, surfaceMeshes: counterSurfaceMeshes } = buildCounterPedestal(mats);
    scene.add(pedestalGroup);

    // Soft radial contact shadow plane grounded directly on counter top
    const contactShadowTex = createContactShadowTexture();
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 3.3), contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.004;
    scene.add(contactShadow);

    // Build all 4 interactive cafe hero models
    const { group: cortadoGroup, steamMeshes } = buildCortadoModel(mats);
    const pouroverGroup = buildPourOverModel(mats);
    const croissantGroup = buildCroissantModel(mats);
    const portafilterGroup = buildPortafilterModel(mats);

    const models: Record<ModelKey, THREE.Group> = {
      cortado: cortadoGroup,
      pourover: pouroverGroup,
      croissant: croissantGroup,
      portafilter: portafilterGroup,
    };

    const modelScales: Record<ModelKey, number> = {
      cortado: 1,
      pourover: 0.001,
      croissant: 0.001,
      portafilter: 0.001,
    };

    (Object.keys(models) as ModelKey[]).forEach((key) => {
      const m = models[key];
      const active = key === stateRef.current.activeModel;
      m.visible = active;
      m.scale.setScalar(active ? 1 : 0.001);
      modelScales[key] = active ? 1 : 0.001;
      scene.add(m);
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let currentCounterMat: 'travertine' | 'walnut' | 'slate' = initialPreset.counterMaterial;
    let currentExplode = 0;

    // ResizeObserver for clean responsive canvas without scrollbars
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(1, Math.floor(entry.contentRect.width));
      const h = Math.max(1, Math.floor(entry.contentRect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Pacing loop: hardware GPU uses rAF, software WebGL uses fenceSync afterDraw pacing
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function tick() {
      if (disposed) return;

      const delta = Math.min(clock.getDelta(), 0.08);
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // 1. Smoothly sync cafe interior aesthetic lighting, fog & counter stone/wood
      const targetPreset = AESTHETIC_PRESETS[st.aesthetic];
      const dampLambda = 4.5;
      const lerpAlpha = 1 - Math.exp(-dampLambda * delta);

      _bgTargetColor.set(targetPreset.bgHex);
      if (scene.background instanceof THREE.Color) {
        scene.background.lerp(_bgTargetColor, lerpAlpha);
      }
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(_bgTargetColor, lerpAlpha);
      }

      _keyTargetColor.set(targetPreset.keyLightHex);
      keyLight.color.lerp(_keyTargetColor, lerpAlpha);
      keyLight.intensity = THREE.MathUtils.damp(
        keyLight.intensity,
        targetPreset.keyIntensity,
        dampLambda,
        delta,
      );

      _skyTargetColor.set(targetPreset.hemiSkyHex);
      _groundTargetColor.set(targetPreset.hemiGroundHex);
      hemiLight.color.lerp(_skyTargetColor, lerpAlpha);
      hemiLight.groundColor.lerp(_groundTargetColor, lerpAlpha);
      hemiLight.intensity = THREE.MathUtils.damp(
        hemiLight.intensity,
        targetPreset.hemiIntensity,
        dampLambda,
        delta,
      );

      _rimTargetColor.set(targetPreset.rimLightHex);
      rimLight.color.lerp(_rimTargetColor, lerpAlpha);
      rimLight.intensity = THREE.MathUtils.damp(
        rimLight.intensity,
        targetPreset.rimIntensity,
        dampLambda,
        delta,
      );

      if (currentCounterMat !== targetPreset.counterMaterial) {
        currentCounterMat = targetPreset.counterMaterial;
        const nextMat =
          currentCounterMat === 'walnut'
            ? mats.counterWalnut
            : currentCounterMat === 'slate'
              ? mats.counterSlate
              : mats.counterTravertine;
        counterSurfaceMeshes.forEach((m) => {
          m.material = nextMat;
        });
      }

      // 2. Smoothly cross-scale hero models & apply damped exploded-view separation
      currentExplode = THREE.MathUtils.damp(currentExplode, st.explodeAmount, 6.5, delta);

      (Object.keys(models) as ModelKey[]).forEach((key) => {
        const m = models[key];
        const isTarget = key === st.activeModel;
        const targetScale = isTarget ? 1 : 0.001;
        modelScales[key] = THREE.MathUtils.damp(modelScales[key], targetScale, 8, delta);
        const s = modelScales[key];
        m.visible = s > 0.015;
        if (m.visible) {
          m.scale.setScalar(s);
          m.children.forEach((child) => {
            const basePos = child.userData.basePos as THREE.Vector3 | undefined;
            const explodeOffset = child.userData.explodeOffset as THREE.Vector3 | undefined;
            if (basePos && explodeOffset) {
              child.position.set(
                basePos.x + explodeOffset.x * currentExplode,
                basePos.y + explodeOffset.y * currentExplode,
                basePos.z + explodeOffset.z * currentExplode,
              );
            }
          });
        }
      });

      // 3. Gentle volumetric steam motion on the cortado
      if (models.cortado.visible && !prefersReducedMotion) {
        steamMeshes.forEach((s) => {
          const phase = (s.userData.phase as number) || 0;
          s.position.y = Math.sin(elapsed * 1.15 + phase) * 0.045;
          s.rotation.y = elapsed * 0.28 + phase;
        });
      }

      // 4. Smooth damped camera preset transitions (cancelled if user drags)
      if (st.cameraTransitionActive) {
        const preset = CAMERA_PRESETS[st.cameraPreset];
        _camGoalPos.set(...preset.pos);
        _camGoalTarget.set(...preset.target);
        camera.position.lerp(_camGoalPos, 1 - Math.exp(-5.5 * delta));
        controls.target.lerp(_camGoalTarget, 1 - Math.exp(-5.5 * delta));
        if (
          camera.position.distanceTo(_camGoalPos) < 0.015 &&
          controls.target.distanceTo(_camGoalTarget) < 0.015
        ) {
          st.cameraTransitionActive = false;
        }
      }

      controls.autoRotate = !isSoftwareGl && !prefersReducedMotion && !st.cameraTransitionActive;
      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry.dispose();
        }
      });
      mats.dispose();
      contactShadowTex.dispose();
      contactShadowMat.dispose();
      envRT.dispose();
      renderer.dispose();
    };
  }, []);

  const currentModelInfo = MODEL_SHOWCASE_INFO[activeModel];
  const currentAestheticInfo = AESTHETIC_PRESETS[aesthetic];
  const isLightBackdrop = aesthetic === 'travertine';

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] rounded-xl overflow-hidden border border-black/10 bg-[#EAE7E0]">
      {/* Dedicated isolated WebGL canvas mount — zero sibling HUD interference */}
      <div
        ref={canvasMountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label={`Interactive 3D viewport showing ${currentModelInfo.title} on ${currentAestheticInfo.name} counter`}
      />

      {/* Graceful fallback if WebGL is unavailable */}
      {webglFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EAE7E0] p-8 text-center">
          <img
            src="/src/assets/images/drink_signature_cortado_1795357296256.jpg"
            alt={currentModelInfo.title}
            referrerPolicy="no-referrer"
            className="w-72 h-52 object-cover rounded-lg mb-4"
          />
          <p className="text-sm font-medium text-[#171614]">
            Interactive 3D view paused — displaying studio photography
          </p>
        </div>
      )}

      {/* Minimal Top-Left Spec Header (never blocks center 3D model, no backdrop-blur over WebGL) */}
      <div
        className={`pointer-events-none absolute top-4 left-4 z-10 max-w-xs px-3.5 py-2.5 rounded-lg border ${
          isLightBackdrop
            ? 'bg-[#F6F5F2]/92 border-black/10 text-[#171614]'
            : 'bg-[#171614]/88 border-white/12 text-[#F6F5F2]'
        }`}
      >
        <p className="text-[11px] font-medium opacity-70">
          {currentModelInfo.category} · {currentAestheticInfo.name}
        </p>
        <p className="font-display text-lg font-semibold leading-tight mt-0.5">
          {currentModelInfo.title}
        </p>
        <div className="pointer-events-auto mt-2 flex items-center gap-3">
          <span className="font-mono-tabular text-xs font-medium">
            ${currentModelInfo.price.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onOrderModel(currentModelInfo.linkedMenuId)}
            className={`text-xs font-medium underline underline-offset-4 transition-opacity hover:opacity-75 whitespace-nowrap shrink-0 ${
              isLightBackdrop ? 'text-[#94632E]' : 'text-[#E3B47A]'
            }`}
          >
            Customize &amp; Order
          </button>
        </div>
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero Left/Right Viewport Occlusion, Zero backdrop-filter) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(920px,95%)] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockCollapsed((c) => !c)}
          aria-expanded={!dockCollapsed}
          className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium bg-[#171614]/92 text-[#F6F5F2] border border-white/12 hover:bg-[#252320] transition-colors whitespace-nowrap shrink-0"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show 3D Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        <div
          className={`w-full rounded-xl bg-[#171614]/94 text-[#F6F5F2] border border-white/12 px-4 py-3 transition-transform duration-200 ${
            dockCollapsed ? 'translate-y-[140%] pointer-events-none opacity-0 h-0 py-0 overflow-hidden' : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* 1. 3D Object Switcher */}
            <div className="flex items-center gap-1 bg-white/8 p-1 rounded-lg">
              {(
                [
                  ['cortado', 'Cortado'],
                  ['pourover', 'Pour-Over'],
                  ['croissant', 'Croissant'],
                  ['portafilter', 'Portafilter'],
                ] as [ModelKey, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectModel(key)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeModel === key
                      ? 'bg-[#F6F5F2] text-[#171614]'
                      : 'text-[#D6D1C8] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 2. Physical Cafe Aesthetic Sync Swatches */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#B8B2A7] whitespace-nowrap shrink-0">
                Cafe Ambiance
              </span>
              <div className="flex items-center gap-1.5">
                {(Object.keys(AESTHETIC_PRESETS) as AestheticPresetKey[]).map((key) => {
                  const preset = AESTHETIC_PRESETS[key];
                  const selected = aesthetic === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onSelectAesthetic(key)}
                      title={`${preset.name} (${preset.timeWindow})`}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                        selected
                          ? 'border-[#E3B47A] bg-white/12 text-white'
                          : 'border-white/12 text-[#C8C2B8] hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-sm border border-white/25 shrink-0"
                        style={{ backgroundColor: preset.swatchHex }}
                      />
                      <span>{key === 'travertine' ? 'Morning' : key === 'walnut' ? 'Dusk' : 'Evening'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Exploded View Kinematics Slider */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="explode-slider"
                className="text-[11px] text-[#B8B2A7] whitespace-nowrap shrink-0"
              >
                Layers
              </label>
              <input
                id="explode-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={explodeAmount}
                onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
                className="w-20 accent-[#C99C58] cursor-pointer"
              />
              <span className="font-mono-tabular text-[11px] text-[#D6D1C8] w-8 text-right">
                {Math.round(explodeAmount * 100)}%
              </span>
            </div>

            {/* 4. Camera Angles */}
            <div className="flex items-center gap-1">
              {(
                [
                  ['hero', 'Hero'],
                  ['top', 'Top'],
                  ['closeup', 'Macro'],
                ] as [CameraPresetKey, string][]
              ).map(([presetKey, label]) => (
                <button
                  key={presetKey}
                  type="button"
                  onClick={() => handleCameraPreset(presetKey)}
                  className={`px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    cameraPreset === presetKey
                      ? 'bg-white/18 text-white'
                      : 'text-[#B8B2A7] hover:text-white hover:bg-white/8'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setExplodeAmount(0);
                  handleCameraPreset('hero');
                }}
                aria-label="Reset camera and layers"
                title="Reset view"
                className="p-1.5 rounded-md text-[#B8B2A7] hover:text-white hover:bg-white/8 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
