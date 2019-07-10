import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
// @ts-ignore
import nipplejs from 'nipplejs';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  /**
   * 'plug into' DOM canvas element using @ViewChild
   */
  @ViewChild('canvas') canvasEl : ElementRef;
  @ViewChild('joystick') joystickEl : ElementRef;
  /**
   * Reference Canvas object
   */
  private _CANVAS  : any;
  /**
   * Reference the context for the Canvas element
   */
  private _CONTEXT : any;
  private _JOYSTICK: any;
  private manager: any;
  private height: number;
  private width: number;

  public snake = [  {x: 150, y: 150},  {x: 140, y: 150},  {x: 130, y: 150},  {x: 120, y: 150},  {x: 110, y: 150}];
  private dx: number = 10;
  private dy: number = 0;
  private direction = 'right';
  private foodX: number;
  private foodY: number;

  public score: number = 0;
  public mode: boolean = true;
  public speed: number = 200;
  public timer: number = 0;

  constructor() { }

  ngOnInit() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this._CANVAS = this.canvasEl.nativeElement;
    this._CANVAS.width = window.innerWidth;
    this._CANVAS.height = window.innerHeight;
    this._JOYSTICK = this.joystickEl.nativeElement;
    var options = {
      zone: this._JOYSTICK,
      color: 'blue'
    };
    this.manager = nipplejs.create(options);
    this.manager.on('dir:up', ()=>{
      this.onUp();
    });
    this.manager.on('dir:down', ()=>{
      this.onDown();
    });
    this.manager.on('dir:left', ()=>{
      this.onLeft();
    });
    this.manager.on('dir:right', ()=>{
      this.onRight();
    });
    this.createFood();
    this.main();
    setInterval(()=> {
      this.timer ++;
    }, 1000);

  }

  initialiseCanvas()
  {
    if(this._CANVAS.getContext)
    {
      this.setupCanvas();
    }
  }
  setupCanvas()
  {
    this._CONTEXT = this._CANVAS.getContext('2d');
    this._CONTEXT.fillStyle = "#3e3e3e";
    this._CONTEXT.fillRect(0, 0, this.width, this.height);
  }

  drawSnakePart(snakePart)
  {
    this._CONTEXT.fillStyle = 'lightgreen';
    this._CONTEXT.strokestyle = 'darkgreen';
    this._CONTEXT.fillRect(snakePart.x, snakePart.y, 10, 10);
    this._CONTEXT.strokeRect(snakePart.x, snakePart.y, 10, 10);
  }

  drawSnake() {
    this.snake.forEach((element)=>{
      this.drawSnakePart(element)
        }
    );
  }

  public advanceSnake() {
    let head;
    switch (this.direction) {
      case 'up':
        if(this.snake[0].y <= 0){
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + Math.ceil(this._CANVAS.height / 10) * 10};
        }else{
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        }
        break;
      case 'right':
        if(this.snake[0].x >= this._CANVAS.width ){
          head = {x: 0, y: this.snake[0].y  + this.dy};
        }else{
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        }
        break;
      case 'left':
        if(this.snake[0].x <= 0){
          head = {x: Math.ceil(this._CANVAS.width / 10) * 10, y: this.snake[0].y  + this.dy};
        }else{
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        }
        break;
      case 'down':
        if(this.snake[0].y >= this._CANVAS.height){
          head = {x: this.snake[0].x + this.dx, y: 0};
        }else{
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        }
        break;
    }
    this.snake.unshift(head);
    const didEatFood = this.snake[0].x === this.foodX && this.snake[0].y === this.foodY;
    if (didEatFood){
      this.score ++;
      this.createFood();
    }
    else this.snake.pop();
  }

  main() {
    setTimeout(()=> {
      this.initialiseCanvas();
      this.drawFood();
      this.advanceSnake();
      this.biteItSelf(this.snake);
      this.drawSnake();
      this.main();
      }, this.speed)
  }

  onUp() {
    if(this.direction != 'down'){
      this.direction = 'up';
      this.dx = 0;
      this.dy = -10;
    }

  }

  onLeft() {
    if(this.direction != 'right') {
      this.direction = 'left';
      this.dx = -10;
      this.dy = 0;
    }
  }

  onRight() {
    if(this.direction != 'left') {
      this.direction = 'right';
      this.dx = 10;
      this.dy = 0;
    }
  }

  onDown() {
    if(this.direction != 'up') {
      this.direction = 'down';
      this.dx = 0;
      this.dy = 10;
    }
  }

  randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
  }

  createFood() {
    this.foodX = this.randomTen(0, this.width - 10);
    this.foodY = this.randomTen(0, this.height - 10);
    this.snake.forEach((part)=> {
      const foodIsOnSnake = part.x == this.foodX && part.y == this.foodY;
      if (foodIsOnSnake) this.createFood();
    });
  }

  drawFood() {
    this._CONTEXT.fillStyle = 'red';
    this._CONTEXT.strokestyle = 'darkred';
    this._CONTEXT.fillRect(this.foodX, this.foodY, 10, 10);
    this._CONTEXT.strokeRect(this.foodX, this.foodY, 10, 10);
  }

  biteItSelf(snake) {
    snake.forEach((snakePart, index)=>{
      if(index > 1) {
        if(snake[0].x === snakePart.x && snake[0].y === snakePart.y){
          this.mode = false;
          alert('PERDU!!');
        }
      }
    });
  }

  onSpeedUp() {
    this.speed -= 10;
  }
  onSpeedDown(){
    this.speed += 10;
  }
}
