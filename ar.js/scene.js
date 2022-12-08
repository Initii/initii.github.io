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
}