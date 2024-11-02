import { AnimatedSprite, Container, PointData, Sprite, Texture } from "pixi.js";
import { bfsPathfinding } from "../utils/BfsPathfinding";
import AssetLoad from "../utils/AssetLoad";

export abstract class Character {
    public id: number;
    public name: string;
    public sprite: Container;
    public healthBar: Container;
    public hp: number;
    public maxHp: number;
    public speed: number;
    public damage: number;
    public spriteAni: AnimatedSprite;

    public currentPosition!: { x: number, y: number };
    public goalPosition!: { x: number, y: number };
    public pathfinding!: bfsPathfinding;
    public currentPathIndex: number = 0;
    public isAlive: boolean;

    private healthBarDown!: Sprite;
    private healthBarUp!: Sprite;

    public moveLeftTextures!: Texture[];
    public moveRightTextures!: Texture[];
    public moveDownTextures!: Texture[];
    public moveUpTextures!: Texture[];


    constructor(id: number, name: string, hp: number, speed: number, damage: number) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.speed = speed;
        this.damage = damage;
        this.isAlive = true;

        this.sprite = new Container();
        this.healthBar = new Container();
        this.healthBar.pivot.set(0.5);

        this.spriteAni = new AnimatedSprite(AssetLoad.getAnimation('Boss_move_down'));
        this.initSpriteAnimation();
        this.setHealthBar();
        this.sprite.addChild(this.healthBar);
    }

    // set id(id:number){
    //     this._id = id;
    // }

    // get id():number{
    //     return this._id;
    // }

    // get name():string{
    //     return this._name;
    // }

    // set name(name:string){
    //     this._name = name;
    // }

    // get HP():number{
    //     return this._hp;
    // }

    // set HP(hp:number){
    //     this._maxHp = hp;
    //     this._hp = hp;
    // }

    // get position():PointData{
    //     const position: PointData =  { x: this._sprite.position.x - 64 / 2, y: this._sprite.position.y - 64 / 2 };
    //     return position;
    // }

    // set position(position:PointData){
    //     this._sprite.position.set(position.x, position.y);
    // }

    // get spriteAni():Sprite | AnimatedSprite{
    //     return this._spriteAni;
    // }

    // get speed():number{
    //     return this._speed;
    // }

    // set speed(sp:number){
    //     this._speed = sp;
    // }

    // set damage(damage:number){
    //     this._damage = damage;
    // }

    // get damage(){
    //     return this._damage;
    // }

    private initSpriteAnimation() {
        this.spriteAni.anchor.set(0.5);
        this.spriteAni.animationSpeed = 0.1;
        this.spriteAni.play();
        this.sprite.addChild(this.spriteAni);
    }

    private setHealthBar() {
        this.healthBarDown = new Sprite(AssetLoad.getTexture('hpbar_down'));
        this.healthBarDown.position.set(this.sprite.x - 10, this.sprite.y - 30);
        this.healthBarUp = new Sprite(AssetLoad.getTexture('hpbar_up'));
        this.healthBarUp.position.set(this.sprite.x - 10, this.sprite.y - 30);
        this.healthBar.addChild(this.healthBarDown);
        this.healthBar.addChild(this.healthBarUp);
    }

    public receiveDamage(amount: number): void {
        this.hp = Math.max(this.hp - amount, 0);
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
        }
        this.updateHealthBar();
    }

    protected updateHealthBar() {
        const healthPer = this.hp / this.maxHp;
        this.healthBarUp.scale.x = healthPer;
    }

    abstract update(deltaTime: number): void;

}