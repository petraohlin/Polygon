var camera, scene, stats, renderer, planets, controls, clock, cube, cubes, soundmesh1, soundmesh2, soundmesh3, sound1, sound2, sound3;

	var time = new Date().getTime();
     $(document.body).bind("mousemove keypress", function(e) {
         time = new Date().getTime();
     });

     function refresh() {
         if(new Date().getTime() - time >= 30000) 
             window.location.reload(true);
         else 
             setTimeout(refresh, 10000);
     }

     setTimeout(refresh, 10000);

  	//Anropar funktioner för att bygga världen samt Three.js-inställningnarna, för att sedan rendera
  	function setup() {
	    setupThreeJS();
	    //setupStats();
	    setupWorld();
	    
	}; 

	function animation(){
		requestAnimationFrame(function animate() {
			
			var timer = 0.0001 * Date.now();

	     	for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[i];


				//Var 30:onde blir bouncy, beroende på musiken
				if(i % 30 == 0)
				{

					//Changes cubes dependent on music
		
					if(typeof array === 'object' && array.length > 0){
			
						var k = 0;
						var scale = (array[i] + boost) / 60;
						object.scale.z = (scale < 1 ? 1 : scale);
						object.scale.x = object.scale.z;
						object.scale.y = object.scale.z;
						k += (k < array.length ? 1 : 0);
					}
				}

				//alla else-if satser ger var 50, 70, 80:onde olika omloppsbanor
				else if(i % 50 == 0) 
				{
					object.position.x += Math.cos( timer * 4 );
					object.position.y += Math.sin( timer * 4 );
				}
				else if(i % 70 == 0) 
				{
					object.position.x += Math.cos( timer * 2 );
					object.position.z += Math.sin( timer * 2 );
				}
				else if(i % 80 == 0) 
				{
					object.position.z += Math.cos( timer * 7 );
					object.position.y += Math.sin( timer * 7 );
				}
				else 
				{	
					object.rotation.x += Math.random()*0.01;
					object.rotation.y += 0.01;
				}
						
			}

     	particleLight.position.x = Math.sin( timer * 7 ) * 1000;
		particleLight.position.y = Math.cos( timer * 5 ) * 1000;
		particleLight.position.z = Math.cos( timer * 3 ) * 1000;

		pointLight.position.x = particleLight.position.x;
		pointLight.position.y = particleLight.position.y;
		pointLight.position.z = particleLight.position.z;

		render();
		update();

 		requestAnimationFrame(animate);
		});
 	}

 	function render() {
 		renderer.render(scene, camera);
 	}

 	function update(){

 		sound1.update( camera );
		sound2.update( camera );
		sound3.update( camera );

 		//Particle field update variables
		var dt = clock.getDelta();
		engine.update( dt * 0.5 );

		//stats.update();
 		controls.update(dt);
 		TWEEN.update();

 		//Spärrar kamera att ta sig utanför skybox
 		if ( camera.position.x > 4000 || camera.position.y > 4000 || camera.position.z > 4000)
		{
			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = -4000;
		}

		if ( camera.position.x < -4000 || camera.position.y < -4000 || camera.position.z < -4000)
		{
			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = 4000;
		}
 	}

  	 //Sätter inställningnarna för three.js
   	function setupThreeJS() {
		scene = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(45, window.innerWidth /
		window.innerHeight, 1, 10000);
		camera.position.y = 100;
			camera.position.z = 2000;

		//Renderar i WebGL om webläsaren stödjer det
		if (window.WebGLRenderingContext)
			renderer = new THREE.WebGLRenderer();
		else
			renderer = new THREE.CanvasRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		//Används för styrningen, som i detta fall är FlyControls
		clock = new THREE.Clock();
		controls = new THREE.FlyControls(camera);
		controls.movementSpeed = 100;
		controls.lookSpeed = 0.1;
	}

	function setupStats(){
		stats = new Stats();

			stats.setMode(0); // 0: fps, 1: ms

		// Align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild( stats.domElement );
	}

   	//Definerar världen och objekt som finns i den
   	function setupWorld() {

		//----- SKYBOX -----
   		//Laddar in sex bilder och applicerar som textur på 5000x5000x5000-kub
   		var imagePrefix = "skybox/space-";
		var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
		var imageSuffix = ".jpg";
		var skyGeometry = new THREE.BoxGeometry( 8000, 8000, 8000 );	
		 
		var skyMaterialArray = [];
		for (var i = 0; i < 6; i++)
			skyMaterialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				side: THREE.BackSide
			}));
		var skyMaterial = new THREE.MeshFaceMaterial( skyMaterialArray );
		var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		scene.add( skyBox );

		//Particle field
		this.engine = new ParticleEngine();

		//Particle field parameters
		parameters =
			{
				positionStyle    : Type.CUBE,
				positionBase     : new THREE.Vector3( 0, 0, 0 ),
				positionSpread   : new THREE.Vector3( 3000, 3000, 3000 ),

				velocityStyle    : Type.CUBE,
				velocityBase     : new THREE.Vector3( 0, 0, 0 ),
				velocitySpread   : new THREE.Vector3( 0, 0, 0 ), 
				
				angleBase               : 0,
				angleSpread             : 720,
				angleVelocityBase       : 0,
				angleVelocitySpread     : 0,

				particleTexture : THREE.ImageUtils.loadTexture( 'images/spikey.png' ),
				
				sizeBase    : 20.0,
				sizeSpread  : 2.0,				
				colorBase   : new THREE.Vector3(0.15, 1.0, 0.9), // H,S,L
				colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
				opacityBase : 1,

				particlesPerSecond : 100000,
				particleDeathAge   : 20*60.0,		
				emitterDeathAge    : 0.1
			},

		engine.setValues( parameters );
		engine.initialize();


		//Array med de olika materialen som sfärerna kan få
		var materials = [];
		materials.push(new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}));
		materials.push(new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}));
		materials.push(new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, wireframe: true}));
		materials.push(new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, wireframe: true}));
		materials.push(new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, transparent: false, shading: THREE.FlatShading}));
		materials.push( new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ) );
		materials.push(new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}));
		materials.push(new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}));
		materials.push(new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}));
		materials.push(new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}));
		materials.push(new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}));

		 
		//geometrin som används då materialet är facematerial
		var geometry_pieces = new THREE.SphereGeometry( 25, 32, 16 ); 

			for ( var i = 0, l = geometry_pieces.faces.length; i < l; i ++ ) {

				var face = geometry_pieces.faces[ i ];
				face.materialIndex = Math.floor( Math.random() * materials.length );

			}

			geometry_pieces.materials = materials;
		
		materials.push( new THREE.MeshFaceMaterial( materials ) );


		objects = [];


	    for (var i = 0; i < 150; i++) {

		    var planetRadius = Math.ceil((Math.random() * 80));
		    var planetGeometry = new THREE.IcosahedronGeometry(planetRadius, 1);

            var planetMaterial = materials[Math.ceil(Math.random()*(materials.length-1))];

            //om materialet är faces, väljd då pieces, annars vanliga planet-geometryn.
            var geometry = (planetMaterial instanceof THREE.MeshFaceMaterial) ? geometry_pieces : planetGeometry;

            var planet = new THREE.Mesh(geometry, planetMaterial);

			planet.position.y = Math.floor(Math.random() * 200 - 100) * 15;
			planet.position.z = Math.floor(Math.random() * 200 - 100) * 15;
			planet.position.x = Math.floor(Math.random() * 200 - 100) * 15;

			planet.rotation.x = Math.random() * 200 - 100;
			planet.rotation.y = Math.random() * 200 - 100;
			planet.rotation.z = Math.random() * 200 - 100;
			
			objects.push(planet);
			
			scene.add(planet);
		}


		//----- MODEL -----
		//Skapa JSON-inladdare
		var jsonLoader = new THREE.JSONLoader();

		//Ladda in modeller
  	    jsonLoader.load( "./models/island1.js", addModelToScene1 );
  	   	jsonLoader.load( "./models/snowWorld1.js", addModelToScene2 );
  	   	jsonLoader.load( "./models/planetFarm1.1.js", addModelToScene3 );

  	    //jsonLoader.load( "./models/snowWorld1.js", addModelToScene, 50 );

		//----- MUSIK -----

		// Soundsfärer och soundvariabler kopplade till dessa
		// Svärerna har samma koordinater som världarna

		soundmesh1 = new THREE.Mesh( planetGeometry, planetMaterial );
		soundmesh1.position.set( 0, 0, -300 );
		scene.add( soundmesh1 );

		sound1 = new Sound( [ './music/NatureSound.ogg', './music/NatureSound.ogg' ], 700, 1 );
		sound1.position.copy( soundmesh1.position );
		sound1.play(); 

		soundmesh2 = new THREE.Mesh( planetGeometry, planetMaterial );
		soundmesh2.position.set( 1000,-300,100);
		scene.add( soundmesh2 );

		sound2 = new Sound( [ './music/FrozenSound.mp3', './music/FrozenSound.mp3' ], 700, 1 );
		sound2.position.copy( soundmesh2.position );
		sound2.play();

		soundmesh3 = new THREE.Mesh( planetGeometry, planetMaterial );
		soundmesh3.position.set(-700,500,700);
		scene.add( soundmesh3 );

		sound3 = new Sound( [ './music/FarmSound.mp3', './music/FarmSound.mp3' ], 700, 1 );
		sound3.position.copy( soundmesh3.position );
		sound3.play(); 


			//----- LJUS -----
			//Ambient light 1
			var ambiColor = "#0c0c0c";
			var ambientLight = new THREE.AmbientLight(ambiColor);
			scene.add(ambientLight);

			//Ambient light 2
			var ambientLight = new THREE.AmbientLight(0x111111);
        scene.add(ambientLight);

			//Directional light
			var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
		directionalLight.position.x = Math.random() * 400;
		directionalLight.position.y = Math.random() * 400;
		directionalLight.position.z = Math.random() * 400;
		directionalLight.position.normalize();
		scene.add( directionalLight );

		//Hemisphere light
		hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 500, 0 );
		scene.add( hemiLight );

		//stjärna som upplevs lysa
		particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
		scene.add( particleLight );

		//ljuset åt stjärnan
		pointLight = new THREE.PointLight( 0xffffff, 1 );
		scene.add( pointLight );
	}

	//Skapar modell i scenen med flat material
	function addModelToScene1( geometry, materials ) 
        {
	        var material = new THREE.MeshFaceMaterial( materials );

	        for ( var i = 0; i < materials.length; i ++ ) {

				materials[i].shading = THREE.FlatShading;
			}

	        model = new THREE.Mesh( geometry, material );
	        model.scale.set(12.5, 12.5, 12.5);
	        model.position.set(0, 0, -300);
	       scene.add(model);
	        
    	}


    //Skapar modell i scenen med flat material
	function addModelToScene2( geometry, materials ) 
        {
	        var material = new THREE.MeshFaceMaterial( materials );

	        for ( var i = 0; i < materials.length; i ++ ) {

				materials[i].shading = THREE.FlatShading;
			}

	        model = new THREE.Mesh( geometry, material );
	        model.scale.set(15, 15, 15);

	        model.position.set(1000,-300,100);
	        scene.add( model );

	        /*Om vi vill ha flera av samma
	        model.position.set(700,-200,0);

	       	for(var i = 0; i < 3; i++)
	        {
	        	var temp = model.clone();
	        	temp.position.y = Math.floor(Math.random() * 200 - 100) * 15;
				temp.position.z = Math.floor(Math.random() * 200 - 100) * 15;
				temp.position.x = Math.floor(Math.random() * 200 - 100) * 15;

				scene.add(temp);
	        }*/

    }

    //Skapar modell i scenen med flat material
	function addModelToScene3( geometry, materials ) 
        {
	        var material = new THREE.MeshFaceMaterial( materials );

	        for ( var i = 0; i < materials.length; i ++ ) {

				materials[i].shading = THREE.FlatShading;
			}

	        model = new THREE.Mesh( geometry, material );
	        model.scale.set(15, 15, 15);

	        model.position.set(-700,500,700);
	        scene.add( model );

    }


	setup();
	animation();