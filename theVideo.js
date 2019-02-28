//pong clone
//mouse to control both paddles

var paddleA, paddleB, ball, wallTop, wallBottom;
var MAX_SPEED = 10;
var video;
var noseY = 0;
let font,fontsize = 40;
var count;

function setup() {
  createCanvas(800, 400);
  count =  document.getElementById("count").innerHTML;
  
  font = loadFont('assets/SourceSansPro-Regular.otf');
  //frameRate(6);
  video = createCapture({
    audio: false,
    video: {
      facingMode: "user"
    }
  });
  video.size(600,400);
  video.hide();
  poseNet = ml5.poseNet(video,modelReady);
  poseNet.on('pose',getPoses);
  
  paddleA = createSprite(30, height/2, 10, 100);
  paddleA.immovable = true;

  paddleB = createSprite(width-28, height/2, 10, 100);
  paddleB.immovable = true;

  wallTop = createSprite(width/2, -30/2, width, 30);
  wallTop.immovable = true;

  wallBottom = createSprite(width/2, height+30/2, width, 30);
  wallBottom.immovable = true;

  ball = createSprite(width/2, height/2, 10, 10);
  ball.maxSpeed = MAX_SPEED;

  paddleA.shapeColor = paddleB.shapeColor =ball.shapeColor = color(255, 255, 255);

  ball.setSpeed(MAX_SPEED, -180);
}

function getPoses(poses){
  if(poses.length > 0){
    let newY = poses[0].pose.keypoints[0].position.y;
    noseY = lerp(noseY,newY,0.2);
  }
	
}

function modelReady(){
	console.log("ready");
}

function draw() {
  background(50);

  //fill(0);
  //text('hi', x, 80);

  var opY = map(noseY,50,200,0,400);
  paddleA.position.y = constrain(opY, paddleA.height/2, height-paddleA.height/2);
  paddleB.position.y = constrain(opY, paddleA.height/2, height-paddleA.height/2);

  ball.bounce(wallTop);
  ball.bounce(wallBottom);

  var swing;
  if(ball.bounce(paddleA)) {
    swing = (ball.position.y-paddleA.position.y)/3;
    ball.setSpeed(MAX_SPEED, ball.getDirection()+swing);
    count = +count + 1;
    document.getElementById("count").innerHTML = count;
  }

  if(ball.bounce(paddleB)) {
    swing = (ball.position.y-paddleB.position.y)/3;
    ball.setSpeed(MAX_SPEED, ball.getDirection()-swing);
    count = +count + 1;
    document.getElementById("count").innerHTML = count;
  }

  if(ball.position.x<0) {
    ball.position.x = width/2;
    ball.position.y = height/2;
    ball.setSpeed(MAX_SPEED, 0);
    document.getElementById("count").innerHTML = 0;
    count = 0;
    //delay(5000);
  }

  if(ball.position.x>width) {
    ball.position.x = width/2;
    ball.position.y = height/2;
    ball.setSpeed(MAX_SPEED, 180);
    document.getElementById("count").innerHTML = 0;
    count = 0;
  }

  drawSprites();

}

