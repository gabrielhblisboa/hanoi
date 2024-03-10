var scene;
var camera;
var renderer;

var cube;

var base_time=70

var diskHeight = 1;

var possible_disks = ["A", "B", "C", "D", "E", "F"]

var rod_disks = {
    1: [],
    2: [],
    3: []
}

var disks_radius = {
    "A": 1,
    "B": 2,
    "C": 3,
    "D": 4,
    "E": 4.5,
    "F": 5,
}
 
var disks_color = {
    "A": "#FB8C00",
    "B": "#1E88E5",
    "C": "#43A047",
    "D": "#7E57C2",
    "E": "#FDD835",
    "F": "#E53935",
}

var n_disks = 6

var initDisks = function() {
    var disks = {}
    for (let i = n_disks-1; i >= 0; i--) {
        diskId = possible_disks[i]
        height = (n_disks-i)*diskHeight
        rod_disks[1].push(diskId)
        disk = this.createDisk(-10, height, 0, diskId);
        disks[diskId] = disk
    }
    return disks
}

var solveHanoi = function(n, rod1, rod2, rod3, list) {
    if (n > 0) {
        solveHanoi (n-1, rod1, rod3, rod2, list);
        list.push({1:rod1,2:rod2})
        solveHanoi (n-1, rod3, rod2, rod1, list);
    }
} 

const originRod = 1; // Set the initial origin rod
let destinationRod = 2; // Set the initial destination rod

var makeMove = function() {
  const data = {
    origin: originRod,
    destination: destinationRod
  };

  fetch('http://localhost:5000/hanoi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      const move = result.move;
      if (move) {
        console.log('Received move:', move);
        moveDisk(disks, rods, move[0], move[1])
        setTimeout(makeMove, 7*base_time);
      } else {
        console.log('No more moves.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

var init = function() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCFD8DC);
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.lookAt(0, 0, 0);
    renderer = new THREE.WebGLRenderer({ antialias : true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // this.createACube();
    disks = initDisks()

    rod1 = this.createRod(-10, 4, 0);
    rod2 = this.createRod(0, 4, 0);
    rod3 = this.createRod(+10, 4, 0);



    rods = {
        1: rod1,
        2: rod2,
        3: rod3
    }

    let movement_list = []
    solveHanoi(n_disks, 1, 3, 2, movement_list)

    animate()
    // var d = delay(() => {}, 500)

    // var d = delay(() => moveDisk(disks, rods, 1, 2), 10)

    // for (let i = 0; i < movement_list.length; i++) {
    //     let element = movement_list[i]
    //     let origin = element[1]
    //     let destination = element[2]
    //     {
    //         let currentOrigin = origin;
    //         let currentDestination = destination;
    //         d.delay(() => moveDisk(disks, rods, currentOrigin, currentDestination), 1100)
    //           .delay(() => console.log(i), 100);
    //       }
    // }

    // d.delay(() => moveDisk(disks, rods, 1, 2), 10)
    // d.delay(() => moveDisk(disks, rods, 1, 3), 1100)
    // d.delay(() => moveDisk(disks, rods, 2, 3), 1100);
    // d.delay(() => moveDisk(disks, rods, 1, 2), 1100);
    // d.delay(() => moveDisk(disks, rods, 3, 1), 1100);
    // d.delay(() => moveDisk(disks, rods, 3, 2), 1100);
    // d.delay(() => moveDisk(disks, rods, 1, 2), 1100);
    // d.delay(() => moveDisk(disks, rods, 1, 3), 1100);
    // d.delay(() => moveDisk(disks, rods, 2, 3), 1100);
    // d.delay(() => moveDisk(disks, rods, 2, 1), 1100);
    // d.delay(() => moveDisk(disks, rods, 3, 1), 1100);
    // d.delay(() => moveDisk(disks, rods, 2, 3), 1100);
    // d.delay(() => moveDisk(disks, rods, 1, 2), 1100);
    // d.delay(() => moveDisk(disks, rods, 1, 3), 1100);
    // d.delay(() => moveDisk(disks, rods, 2, 3), 1100);
        
    // 

    this.createPlane();
    this.createLight();
    this.createWall()

    camera.position.z = 30;
    camera.position.y = 15;

    this.render();
    this.makeMove();
};

var tweenMove = function(diskObj, new_y, new_x, final_y) {
    const tweenAsc = new TWEEN.Tween({y:diskObj.position.y})
    .to({y : new_y}, base_time)
    .onUpdate((coords) => {
        diskObj.position.y = coords.y
    })
    const tweenX = new TWEEN.Tween({x:diskObj.position.x})
        .to({x : new_x}, 4*base_time)
        .onUpdate((coords) => {
            diskObj.position.x = coords.x
    })
    const tweenDesc = new TWEEN.Tween({y:new_y})
        .to({y : final_y}, 2*base_time)
        .onUpdate((coords) => {
            diskObj.position.y = coords.y
    })
    // tweenX.chain(tweenDesc)
    tweenAsc.chain(tweenX)
    tweenX.chain(tweenDesc)

    return tweenAsc
}

var moveDisk = function(disks, rods, or_rod, d_rod) {
    console.log("ini")
    let origin_rod = or_rod;
    let dest_rod = d_rod
    console.log(origin_rod, dest_rod)


    diskId = rod_disks[origin_rod].pop()
    console.log(diskId)

    diskObj = disks[diskId]
    rodObj = rods[dest_rod]

    new_x_pos = rodObj.position.x
    
    tween = tweenMove(diskObj, 11, new_x_pos, 
        diskHeight*rod_disks[dest_rod].length)
    tween.start()

    diskObj.position.y = diskHeight*rod_disks[dest_rod].length
    rod_disks[dest_rod].push(diskId)
}

var createDisk = function(x, y, z, disk) {

    cylinder = createCylinder(disks_radius[disk], diskHeight, 
        50, disks_color[disk])
    cylinder.position.x = x;
    cylinder.position.y = y;
    cylinder.position.z = z;
    return cylinder
}

var createRod = function(x, y, z) {
    rod = createCylinder(0.5, 10, 20, "grey")
    rod.position.set(x,y,z)
    return rod;
}

var createCylinder = function(radius, height, radial, color) {
    var geometry = new THREE.CylinderGeometry(radius,
        radius, height, radial, 1);
    var material = new THREE.MeshToonMaterial({
        color: color
});

    cylinder = new THREE.Mesh( geometry, material);

    cylinder.castShadow = true;

    scene.add(cylinder);

    return cylinder
}


var createWall = function () {
    var planeGeometry = new THREE.PlaneGeometry(100, 200);
    var planeMaterial = new THREE.MeshToonMaterial({ color: 0xcccccc});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);


    plane.position.y = 1;
    plane.position.z = -20
    plane.position.x = 1

    plane.receiveShadow = true;

    // scene.add(plane);
}

var createPlane = function() {
    var planeGeometry = new THREE.PlaneGeometry(60, 70);
    var planeMaterial = new THREE.MeshToonMaterial({ color: 0xcccccc});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -1;

    plane.receiveShadow = true;

    scene.add(plane);
};

var render = function() {
    requestAnimationFrame( render );


    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.shadowMap.cullFace = THREE.CullFaceBack; //And the other one

    renderer.render( scene, camera );
};

var createLight = function () {
    var spotLight = new THREE.SpotLight(0xffffff);
    // var light = new THREE.AmbientLight(0xffffff, .3);
    spotLight.position.set(10, 20, 20);
    spotLight.castShadow = true;
    scene.add(spotLight);
    // scene.add(light);

    // spotLight.shadow.bias = 0.0001;
    spotLight.shadow.mapSize.width = 3060;
    spotLight.shadow.mapSize.height = 3060;
    
};


var animate = function(t) {
    TWEEN.update(t);
    window.requestAnimationFrame(animate);
}

window.onload = this.init;
