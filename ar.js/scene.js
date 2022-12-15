function body_loaded() {
    let renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        precision: "mediump",
    });

    let clock = new THREE.Clock();

    let mixers = [];

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setClearColor(new THREE.Color('lightgray'), 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    document.body.appendChild(renderer.domElement);

    let scene = new THREE.Scene();

    let camera = new THREE.Camera();
    scene.add(camera);

    let light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    let arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: "webcam",
        sourceWidth: 480,
        sourceHeight: 640,
    });

    arToolkitSource.init(function onReady(){
        setTimeout(function(){
            onResize()
        }, 1000);
    });

    window.addEventListener("resize", function(ev){
        console.log(ev);
    });

    window.addEventListener("arjs-nft-loaded", function(ev){
        console.log(ev);
    });

    function onResize(){
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(renderer.domElement);
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
        }
    }

    let arToolkitContext = new THREEx.ArToolkitContext({
        detectionMode: "mono",
        canvasWidth: 480,
        canvasHeight: 640,
    }, {
        sourceWidth: 480,
        sourceHeight: 640,
    });

    arToolkitContext.init(function onCompleted(){
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    })
    console.log(arToolkitContext);

    let markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
        type: "nft",
        descriptorsUrl: "./nft/50euro_140x77mm",
        changeMatrixMode: "cameraTransformMatrix",
    });

    scene.visible = false;

    let root = new THREE.Object3D();
    scene.add(root);

    let threeGLTFLoader = new THREE.GLTFLoader();
    let model;

    threeGLTFLoader.load("./model/cube.glb", function(gltf){
        model = gltf.scene.children[0];
        model.name = "cube";

        root.matrixAutoUpdate = false;
        root.add(model);

        window.addEventListener('arjs-nft-init-data', function(nft) {
            console.log(nft);
            var msg = nft.detail;
            model.position.y = (msg.height / msg.dpi * 2.54 * 10)/2.0; //y axis?
            model.position.x = (msg.width / msg.dpi * 2.54 * 10)/2.0; //x axis?
        })

        let animate = function(){
            requestAnimationFrame(animate);
    
            if (!arToolkitSource.ready)
                return;
    
            arToolkitContext.update(arToolkitSource.domElement);
    
            scene.visible = camera.visible;
    
            renderer.render(scene, camera);
        }

        requestAnimationFrame(animate);
        console.log("TEST");
    });
}