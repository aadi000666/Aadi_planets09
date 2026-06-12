import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { PLANETS } from '../data/planets';

export function useThreeScene(canvasRef, onPlanetClick) {
  const stateRef = useRef({
    renderer: null, scene: null, camera: null,
    planetMeshes: [], moonMeshes: [], orbitLines: [],
    orbitAngles: [], moonAngles: [],
    animId: null, paused: false, speedMult: 1,
    isDragging: false, lastX: 0, lastY: 0,
    rotX: 0.38, rotY: 0, zoom: 680,
    targetPos: new THREE.Vector3(0, 0, 0),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;

    // ── Renderer ──
    s.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    s.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    s.renderer.setClearColor(0x00000A);
    s.renderer.shadowMap.enabled = true;
    s.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ── Scene ──
    s.scene = new THREE.Scene();
    s.scene.fog = new THREE.FogExp2(0x00000A, 0.00018);

    // ── Camera ──
    s.camera = new THREE.PerspectiveCamera(52, 1, 0.1, 20000);
    s.camera.position.set(0, 220, 680);
    s.camera.lookAt(0, 0, 0);

    // ── Starfield — 3 layers for depth ──
    [
      { count: 5000, size: 0.9,  range: 4000 },
      { count: 3000, size: 0.45, range: 6000 },
      { count: 1500, size: 1.5,  range: 2500 },
    ].forEach(({ count, size, range }) => {
      const verts = [];
      for (let i = 0; i < count; i++) {
        verts.push(
          (Math.random() - 0.5) * range,
          (Math.random() - 0.5) * range,
          (Math.random() - 0.5) * range
        );
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      s.scene.add(new THREE.Points(geo,
        new THREE.PointsMaterial({
          color: 0xffffff, size,
          sizeAttenuation: true,
          transparent: true, opacity: 0.85,
        })
      ));
    });

    // ── Lighting ──
    // 1. Strong ambient — no planet ever goes black
    s.scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    // 2. Hemisphere — warm top / cool bottom
    s.scene.add(new THREE.HemisphereLight(0xFFEECC, 0x223366, 1.0));
    // 3. Sun point light — infinite range
    const sunLight = new THREE.PointLight(0xFFEEAA, 3.5, 0);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    s.scene.add(sunLight);
    // 4. Rim / fill from opposite side
    const rimLight = new THREE.DirectionalLight(0x8899ff, 0.7);
    rimLight.position.set(-300, 150, -300);
    s.scene.add(rimLight);
    // 5. Camera-follow fill — always illuminates what you're looking at
    const camFill = new THREE.DirectionalLight(0xffffff, 0.5);
    camFill.position.set(300, 200, 300);
    s.scene.add(camFill);

    // ── Planet size multiplier — everything bigger & clearer ──
    const SIZE = 2.2;

    // ── Build planets ──
    s.planetMeshes = [];
    s.moonMeshes = [];
    s.orbitAngles = PLANETS.map(() => Math.random() * Math.PI * 2);
    s.moonAngles  = PLANETS.map(p => p.moons.map(() => Math.random() * Math.PI * 2));

    PLANETS.forEach((p, i) => {
      const r   = p.radius * SIZE;
      const geo = new THREE.SphereGeometry(r, 64, 64);

      let mat;

      if (p.id === 'sun') {
        mat = new THREE.MeshStandardMaterial({
          color:            new THREE.Color(p.color),
          emissive:         new THREE.Color(p.emissiveColor || '#FF5500'),
          emissiveIntensity: 2.2,
          roughness: 0.6,
        });
      } else if (p.id === 'earth') {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color('#3A8FD4'),
          emissive: new THREE.Color('#0A2A55'),
          shininess: 35,
          specular: new THREE.Color('#6AADFF'),
        });
      } else if (p.id === 'jupiter') {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color('#C88B3A'),
          emissive: new THREE.Color('#3A2008'),
          shininess: 12,
          specular: new THREE.Color('#AA7733'),
        });
      } else if (p.id === 'saturn') {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color('#E4C47A'),
          emissive: new THREE.Color('#3A2E10'),
          shininess: 14,
          specular: new THREE.Color('#CCAA55'),
        });
      } else if (p.id === 'uranus') {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color('#7DE8E8'),
          emissive: new THREE.Color('#0A3A3A'),
          shininess: 28,
          specular: new THREE.Color('#AAFFFF'),
        });
      } else if (p.id === 'neptune') {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color('#3F54BA'),
          emissive: new THREE.Color('#0A1040'),
          shininess: 30,
          specular: new THREE.Color('#6680EE'),
        });
      } else if (p.id === 'mars') {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color('#C1440E'),
          emissive: new THREE.Color('#3A0A00'),
          shininess: 10,
          specular: new THREE.Color('#884422'),
        });
      } else if (p.id === 'venus') {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color('#E8C560'),
          emissive: new THREE.Color('#3A2A00'),
          shininess: 20,
          specular: new THREE.Color('#FFDD88'),
        });
      } else if (p.id === 'mercury') {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color('#AAAAAA'),
          emissive: new THREE.Color('#1A1A1A'),
          shininess: 8,
          specular: new THREE.Color('#888888'),
        });
      } else {
        mat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color(p.color),
          emissive: new THREE.Color(p.color).multiplyScalar(0.22),
          shininess: 18,
          specular: new THREE.Color(0x333333),
        });
      }

      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.z = THREE.MathUtils.degToRad(p.tilt || 0);
      mesh.userData   = { planetIndex: i, type: 'planet' };
      mesh.castShadow    = true;
      mesh.receiveShadow = true;

      // ── Saturn rings — improved ──
      if (p.hasRings) {
        const innerR = r * 1.42;
        const outerR = r * 2.65;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 120);
        // make UVs radial so colour blends nicely
        const posAttr = ringGeo.attributes.position;
        const uvAttr  = ringGeo.attributes.uv;
        for (let j = 0; j < posAttr.count; j++) {
          const v = new THREE.Vector3().fromBufferAttribute(posAttr, j);
          uvAttr.setXY(j, (v.length() - innerR) / (outerR - innerR), 0);
        }
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xD4B483,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.82,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.3;
        mesh.add(ring);

        // inner darker band
        const ring2Geo = new THREE.RingGeometry(innerR * 0.88, innerR, 120);
        const ring2Mat = new THREE.MeshBasicMaterial({
          color: 0x8B6A30,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55,
        });
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.x = Math.PI / 2.3;
        mesh.add(ring2);
      }

      // ── Jupiter bands — layered ──
      if (p.id === 'jupiter') {
        const bandColors = ['#A0622A','#8B5220','#C8903C','#6B3A12','#D4A050'];
        bandColors.forEach((col, bi) => {
          const bGeo = new THREE.SphereGeometry(r + 0.02 + bi * 0.015, 32, 6);
          const bMat = new THREE.MeshStandardMaterial({
            color: col, roughness: 1,
            transparent: true, opacity: 0.22,
          });
          mesh.add(new THREE.Mesh(bGeo, bMat));
        });
        // Great Red Spot hint
        const spotGeo = new THREE.SphereGeometry(r * 0.12, 16, 16);
        const spotMat = new THREE.MeshBasicMaterial({ color: 0xAA3322, transparent: true, opacity: 0.7 });
        const spot    = new THREE.Mesh(spotGeo, spotMat);
        spot.position.set(r * 0.85, -r * 0.15, r * 0.5);
        mesh.add(spot);
      }

      // ── Earth cloud layer ──
      if (p.id === 'earth') {
        const cloudGeo = new THREE.SphereGeometry(r * 1.018, 48, 48);
        const cloudMat = new THREE.MeshPhongMaterial({
          color: 0xffffff, transparent: true, opacity: 0.22,
          depthWrite: false,
        });
        const clouds = new THREE.Mesh(cloudGeo, cloudMat);
        clouds.userData = { isCloud: true };
        mesh.add(clouds);
      }

      // ── Atmosphere glow for gas giants ──
      if (['jupiter','saturn','uranus','neptune'].includes(p.id)) {
        const atmGeo = new THREE.SphereGeometry(r * 1.04, 32, 32);
        const atmCol = p.id === 'uranus'  ? 0x44CCCC
                     : p.id === 'neptune' ? 0x2244AA
                     : p.id === 'saturn'  ? 0xBB9944
                     :                      0xAA6622;
        const atmMat = new THREE.MeshBasicMaterial({
          color: atmCol, transparent: true, opacity: 0.12,
          side: THREE.BackSide,
        });
        mesh.add(new THREE.Mesh(atmGeo, atmMat));
      }

      // ── Orbit line — dashed-style via segments ──
      if (p.orbitRadius > 0) {
        const pts = [];
        for (let j = 0; j <= 180; j++) {
          const a = (j / 180) * Math.PI * 2;
          pts.push(new THREE.Vector3(
            Math.cos(a) * p.orbitRadius, 0,
            Math.sin(a) * p.orbitRadius
          ));
        }
        const oGeo  = new THREE.BufferGeometry().setFromPoints(pts);
        const oLine = new THREE.Line(oGeo,
          new THREE.LineBasicMaterial({ color: 0x1E3060, transparent: true, opacity: 0.5 })
        );
        s.scene.add(oLine);
      }

      s.scene.add(mesh);
      s.planetMeshes.push(mesh);

      // ── Moons ──
      const moonGroup = [];
      p.moons.forEach((moon) => {
        const mR   = moon.radius * SIZE * 1.3;
        const mGeo = new THREE.SphereGeometry(mR, 24, 24);
        const mMat = new THREE.MeshPhongMaterial({
          color:    new THREE.Color(moon.color),
          emissive: new THREE.Color(moon.color).multiplyScalar(0.15),
          shininess: 8,
        });
        const mMesh = new THREE.Mesh(mGeo, mMat);
        mMesh.userData = { type: 'moon', moonName: moon.name };
        s.scene.add(mMesh);
        moonGroup.push(mMesh);
      });
      s.moonMeshes.push(moonGroup);
    });

    // ── Sun glow sprite — larger, more dramatic ──
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 512;
    const ctx  = glowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    grad.addColorStop(0,    'rgba(255,240,150,1)');
    grad.addColorStop(0.15, 'rgba(255,180, 40,0.85)');
    grad.addColorStop(0.4,  'rgba(255,100,  0,0.45)');
    grad.addColorStop(0.7,  'rgba(255, 60,  0,0.12)');
    grad.addColorStop(1,    'rgba(255, 30,  0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glow    = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    const sunR = PLANETS[0].radius * SIZE;
    glow.scale.set(sunR * 7, sunR * 7, 1);
    s.scene.add(glow);

    // ── Resize ──
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      s.renderer.setSize(w, h, false);
      s.camera.aspect = w / h;
      s.camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Animate ──
    let last = performance.now();
    function animate(now) {
      s.animId = requestAnimationFrame(animate);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!s.paused) {
        PLANETS.forEach((p, i) => {
          // Orbit
          if (p.orbitRadius > 0) {
            s.orbitAngles[i] += p.orbitSpeed * 0.004 * s.speedMult * dt * 60;
            s.planetMeshes[i].position.set(
              Math.cos(s.orbitAngles[i]) * p.orbitRadius,
              0,
              Math.sin(s.orbitAngles[i]) * p.orbitRadius
            );
          }

          // Self-rotation
          s.planetMeshes[i].rotation.y += p.rotationSpeed * s.speedMult;

          // Rotate Earth clouds a little faster
          if (p.id === 'earth') {
            const clouds = s.planetMeshes[i].children.find(c => c.userData.isCloud);
            if (clouds) clouds.rotation.y += 0.0003 * s.speedMult;
          }

          // Moons
          p.moons.forEach((moon, mi) => {
            s.moonAngles[i][mi] += moon.speed * 0.004 * s.speedMult * dt * 60;
            const px = s.planetMeshes[i].position;
            s.moonMeshes[i][mi].position.set(
              px.x + Math.cos(s.moonAngles[i][mi]) * moon.orbitRadius * SIZE,
              px.y,
              px.z + Math.sin(s.moonAngles[i][mi]) * moon.orbitRadius * SIZE
            );
          });
        });
      }

      s.renderer.render(s.scene, s.camera);
    }
    animate(performance.now());

    return () => {
      cancelAnimationFrame(s.animId);
      ro.disconnect();
      s.renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Mouse / Touch controls ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;

    function updateCamera() {
      const t = s.targetPos;
      s.camera.position.set(
        t.x + Math.sin(s.rotY) * Math.cos(s.rotX) * s.zoom,
        t.y + Math.sin(s.rotX) * s.zoom,
        t.z + Math.cos(s.rotY) * Math.cos(s.rotX) * s.zoom
      );
      s.camera.lookAt(t);
    }

    function onMouseDown(e) { s.isDragging = true; s.lastX = e.clientX; s.lastY = e.clientY; }
    function onMouseUp()    { s.isDragging = false; }
    function onMouseMove(e) {
      if (!s.isDragging) return;
      s.rotY += (e.clientX - s.lastX) * 0.007;
      s.rotX += (e.clientY - s.lastY) * 0.007;
      s.rotX  = Math.max(-1.4, Math.min(1.4, s.rotX));
      s.lastX = e.clientX; s.lastY = e.clientY;
      updateCamera();
    }
    function onWheel(e) {
      e.preventDefault();
      s.zoom = Math.max(25, Math.min(2200, s.zoom + e.deltaY * 0.6));
      updateCamera();
    }

    // Touch
    let lastTouchDist = null;
    function onTouchStart(e) {
      if (e.touches.length === 1) { s.isDragging = true; s.lastX = e.touches[0].clientX; s.lastY = e.touches[0].clientY; }
      if (e.touches.length === 2) lastTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
    function onTouchMove(e) {
      if (e.touches.length === 1 && s.isDragging) {
        s.rotY += (e.touches[0].clientX - s.lastX) * 0.007;
        s.rotX += (e.touches[0].clientY - s.lastY) * 0.007;
        s.rotX  = Math.max(-1.4, Math.min(1.4, s.rotX));
        s.lastX = e.touches[0].clientX; s.lastY = e.touches[0].clientY;
        updateCamera();
      }
      if (e.touches.length === 2 && lastTouchDist) {
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        s.zoom = Math.max(25, Math.min(2200, s.zoom - (d - lastTouchDist) * 1.2));
        lastTouchDist = d;
        updateCamera();
      }
    }
    function onTouchEnd() { s.isDragging = false; lastTouchDist = null; }

    // Click → planet
    function onClick(e) {
      const rect  = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
         ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        -((e.clientY - rect.top)  / rect.height) * 2 + 1
      );
      const ray = new THREE.Raycaster();
      ray.setFromCamera(mouse, s.camera);
      const hits = ray.intersectObjects(s.planetMeshes, true);
      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj.parent && obj.userData.planetIndex === undefined) obj = obj.parent;
        if (obj.userData.planetIndex !== undefined) onPlanetClick(obj.userData.planetIndex);
      }
    }

    canvas.addEventListener('mousedown',  onMouseDown);
    canvas.addEventListener('mouseup',    onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('wheel',      onWheel, { passive: false });
    canvas.addEventListener('click',      onClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: true });
    canvas.addEventListener('touchend',   onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown',  onMouseDown);
      canvas.removeEventListener('mouseup',    onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('wheel',      onWheel);
      canvas.removeEventListener('click',      onClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   onTouchEnd);
    };
  }, [canvasRef, onPlanetClick]);

  // ── Focus camera on planet ────────────────────────────────
  const focusPlanet = useCallback((index) => {
    const s    = stateRef.current;
    const mesh = s.planetMeshes[index];
    if (!mesh) return;
    const p    = PLANETS[index];
    const dist = p.radius * 2.2 * 5 + 60;
    s.targetPos.copy(mesh.position);
    s.zoom = dist;
    s.camera.position.set(
      mesh.position.x + dist * 0.7,
      mesh.position.y + dist * 0.4,
      mesh.position.z + dist * 0.7
    );
    s.camera.lookAt(mesh.position);
  }, []);

  const resetView = useCallback(() => {
    const s = stateRef.current;
    s.targetPos.set(0, 0, 0);
    s.rotX = 0.38; s.rotY = 0; s.zoom = 680;
    s.camera.position.set(0, 220, 680);
    s.camera.lookAt(0, 0, 0);
  }, []);

  const setPaused    = useCallback((v) => { stateRef.current.paused    = v; }, []);
  const setSpeedMult = useCallback((v) => { stateRef.current.speedMult = v; }, []);

  return { focusPlanet, resetView, setPaused, setSpeedMult };
}