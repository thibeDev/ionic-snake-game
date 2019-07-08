import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Platform} from '@ionic/angular';
import {element} from 'protractor';

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
  /**
   * Reference Canvas object
   */
  private _CANVAS  : any;
  /**
   * Reference the context for the Canvas element
   */
  private _CONTEXT : any;
  private height: number;
  private width: number;

  public snake = [  {x: 150, y: 150},  {x: 140, y: 150},  {x: 130, y: 150},  {x: 120, y: 150},  {x: 110, y: 150}];
  private dx: number = 10;
  private dy: number = 0;
  private direction = 'right';
  private foodX: number;
  private foodY: number;

  constructor( private platform: Platform) { }

  ngOnInit() {
    this.height = this.platform.height() - 150;
    this.width = this.platform.width();
    this._CANVAS 	    = this.canvasEl.nativeElement;
    this._CANVAS.width  	= this.width;
    this._CANVAS.height 	= this.height;
    this.createFood();
    this.main();

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
        if(this.snake[0].y == 0){
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this._CANVAS.height};
        }else{
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        }
        break;
      case 'right':
        if(this.snake[0].x == this.width ){
          head = {x: 0, y: this.snake[0].y  + this.dy};
        }else{
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        }
        break;
      case 'left':
        if(this.snake[0].x == 0){
          head = {x: this.width, y: this.snake[0].y  + this.dy};
        }else{
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        }
        break;
      case 'down':
        if(this.snake[0].y == this._CANVAS.height){
          head = {x: this.snake[0].x + this.dx, y: 0};
        }else{
          head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        }
        break;
    }
    this.snake.unshift(head);
    const didEatFood = this.snake[0].x === this.foodX && this.snake[0].y === this.foodY;
    if (didEatFood) this.createFood();
    else this.snake.pop();
  }

  main() {
    setTimeout(()=> {
      this.initialiseCanvas();
      this.drawFood();
      this.advanceSnake();
      this.drawSnake();
      this.main();
      }, 100)
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

  resetGoing(){
    this.goingDown = false;
    this.goingUp = false;
    this.goingRight = false;
    this.goingLeft = false;
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
}
