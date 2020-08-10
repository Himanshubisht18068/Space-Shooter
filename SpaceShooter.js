var player;

var enemies = new Array; // for storing enimies Mesh
var enemiesSpeed = 2;
var fixedNoOfEnemies = 15;
var currentNoOfEnemies = 0;

var backgroundScreen;

var currentBullets = new Array; // For storing the bullet Mesh
var bulletSpeed = 5;
var NoOfBulletsFired = 0;

// Three.js variables
var scene;
var camera;
var renderer;

var screenOutOfBoundCoordinates = [-110,110,-110,110]; // Coordinates out of view left right bottom up

var pause = 0;// for pausing the game when out of focus


// For calculating the Shape coordinates
var a,b,c,d;
a = b = 4.8;
c= d = -4.8;



// Fire a Bullet
function FireBullet(){
	NoOfBulletsFired++; // increase the count of bullet
	var bullet = new THREE.Mesh(new THREE.BoxGeometry(1,5,1) , new THREE.MeshBasicMaterial()); // adding new bullet
	currentBullets.push(bullet); // pushing new bullet in array
	bullet.position.set(player.position.x,  player.position.y, 0 ); // Setting Bullet position
	scene.add(bullet);
	
}

function onDocumentMouseMove(event){
	//console.log("Moving")
	player.position.x = (200.0/window.innerWidth)*(event.clientX) - 100;
	player.position.y = (-200.0/window.innerHeight)*(event.clientY) + 100;
	renderer.render(scene,camera);	
}

function ReShapeTheCanvas() {
	//alert("ReShapeTheCanvas");
	renderer.setSize(window.innerWidth * .985, window.innerHeight * .97);
	renderer.render(scene,camera);
}

function pauseGame() {
	alert("You moved Out Of Bound area \nPress Enter to Continue ");
}



function initialize() {

	window.addEventListener("click",FireBullet); // for adding Fire option
	window.addEventListener("resize",ReShapeTheCanvas);

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//window.addEventListener('mouseout',pauseGame);
	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera( -100,100,100,-100,-100,100);
	
	camera.position.z += 2;
	scene.add(camera);

	player = new THREE.Mesh(new THREE.BoxGeometry(10,10,10) , new THREE.MeshBasicMaterial({color:"blue"}));
	var playerStartPosX = 0,  playerStartPosY = -10,  playerStartPosZ = 0;
	player.position.set(playerStartPosX,playerStartPosY,playerStartPosZ);
	scene.add(player);

	for(var i =0 ; i < fixedNoOfEnemies ; i++){
		if(Math.random() > 0.99){
			currentNoOfEnemies++;
			enemy = new THREE.Mesh(new THREE.BoxGeometry(10,10,10) , new THREE.MeshBasicMaterial({color:"red"}));
			enemy.position.set((Math.random() - 0.5) * 190,100,0);
			scene.add(enemy);
			enemies.push(enemy);
		}

	}

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth * .985, window.innerHeight * .97 );
	document.getElementById('Game').appendChild( renderer.domElement );
	//document.body.appendChild( renderer.domElement );
	renderer.render(scene,camera);
}

function animate(){
	requestAnimationFrame(animate);


	/*player.position.x += (Math.random() - 0.5) * 10;
	player.position.y += (Math.random() - 0.5) * 10;
	if(player.position.x > 100 || player.position.y > 100 || player.position.x <-100 || player.position.y < -100 ){
		player.position.x = (Math.random() - 0.5) * 200;
		player.position.y = (Math.random() - 0.5) * 200;
	}*/

	for(var i = 0; i < currentNoOfEnemies ; i++){
		
		//player colloide with enemy

		if(enemies[i].position.x + a >= player.position.x - a && enemies[i].position.x + a <= player.position.x + a ){
			if(enemies[i].position.y - b < player.position.y + b && enemies[i].position.y - b > player.position.y - b){
				alert("out");
			}
			else if(enemies[i].position.y + b <= player.position.y + b && enemies[i].position.y + b >= player.position.y - b){
				alert("out")				
			}
		}
		else if(enemies[i].position.x - a>= player.position.x - a && enemies[i].position.x - a <= player.position.x + a){
			if(enemies[i].position.y - b <= player.position.y + b && enemies[i].position.y - b >= player.position.y - b){
				alert("out");
			}
			else if(enemies[i].position.y + b <= player.position.y + b && enemies[i].position.y + b >= player.position.y - b){
				alert("out");	
			}
		}

		// player hit the enemy with bullet
		for(var j=0; j< NoOfBulletsFired; j++){	
	
			if(enemies[i].position.x + a >= currentBullets[j].position.x - a && enemies[i].position.x + a <= currentBullets[j].position.x + a ){
				if(enemies[i].position.y - b < currentBullets[j].position.y + b && enemies[i].position.y - b > currentBullets[j].position.y - b){
					enemies[i].position.y = screenOutOfBoundCoordinates[2];
					currentBullets[j].position.y = screenOutOfBoundCoordinates[3];
				}
								
			}
			else if(enemies[i].position.x - a>= currentBullets[j].position.x - a && enemies[i].position.x - a <= currentBullets[j].position.x + a){
				if(enemies[i].position.y - b <= currentBullets[j].position.y + b && enemies[i].position.y - b >= currentBullets[j].position.y - b){
					currentBullets[j].position.y = screenOutOfBoundCoordinates[3];
					enemies[i].position.y = screenOutOfBoundCoordinates[2];
				}
				
			}
		}

		// checking if enemy is out of camera view
		if(enemies[i].position.y <= screenOutOfBoundCoordinates[2]) {
			// poping the element from array(emeny which is out of bound)
			// replacing it with last element 
			//removing the last element			
			enemies[i] = enemies[currentNoOfEnemies-1];
			
			//removing extra element
			enemies.pop();
			currentNoOfEnemies--;
		}
		enemies[i].position.y -= enemiesSpeed; // Moving enemies
		

	}
	if(currentNoOfEnemies < fixedNoOfEnemies){
		if(Math.random() > 0.9){
			currentNoOfEnemies++;
			enemy = new THREE.Mesh(new THREE.BoxGeometry(10,10,10) , new THREE.MeshBasicMaterial({color:"red"}));
			enemy.position.set((Math.random() - 0.5) * 180,100,0);
			enemies.push(enemy);
			scene.add(enemy);
			}
	}

	for(var j =0; j < NoOfBulletsFired;j++){
		currentBullets[j].position.y += bulletSpeed;	//Moving Bullet
		if(currentBullets[j].position.y > screenOutOfBoundCoordinates[3]){
			//same as enemy
			currentBullets[j] = currentBullets[NoOfBulletsFired - 1];
			currentBullets.pop();
			NoOfBulletsFired--;
		}

	}

	renderer.render(scene,camera);	
}

initialize();
alert("Click To Start the Game");
animate();