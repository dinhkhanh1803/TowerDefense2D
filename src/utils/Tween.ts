// import { settings } from "pixi.js";
// import _Math from '../Math';
// import { PatternEasing } from './Easing';
// export { PatternEasing as Easing };

// export declare type StringKeyOf<T> = string & keyof T;
// export declare type NumericValues<T extends object = object> = Record<StringKeyOf<T>, any>; //TODO: changed from number to any to update pixi 6.0.4. Should find a way to use number instead

// interface IProperty {
//     key: string;
//     origin: number;
//     targetNumber: number;
//     offsetPerMS: number;
//     tweenTime?: number;
// }

// interface TwAction {
//     target: object;
//     duration: number;
//     values: IProperty[];
//     delay?: number;
//     isStarted?: boolean;
//     finishedEvent?: Function;
//     updatedEvent?: Function;
//     startedEvent?: Function;
//     easeFunc?: Function;
// }
// /**
//  * Class for creating & managing Tween script that run automatically frame by frame
//  *  to interpolate numberic values from start to end.
//  *  The update is based on app Tinker update that is using frame DT.
//  */
// export class Tween {

//     private static _scaleTime: number = 1;

//     public static onUpdate(dtScalar: number) {

//         let dt = dtScalar / settings.TARGET_FPMS;

//         dt *= this._scaleTime;

//         this._update(dt);
//     }

//     private static _update(dt: number) {

//         for (const [key, tween] of this._tweenActionMap) {

//             if (tween.delay && tween.delay > 0) {
//                 tween.delay -= dt;
//             } else {
//                 tween.duration = Math.max(0, tween.duration - dt);
//                 if (tween.duration <= 0) {

//                     // Tween is finished
//                     tween.values.forEach((prop) => {
//                         tween.target[prop.key] = prop.targetNumber;
//                     });

//                     if (tween.updatedEvent) {
//                         tween.updatedEvent(dt);
//                     }

//                     if (tween.finishedEvent) {
//                         tween.finishedEvent();
//                     }
//                     this._tweenActionMap.delete(key);
//                 } else {

//                     // Interpotate values
//                     tween.values.forEach((property) => {

//                         if (property.offsetPerMS === undefined) {
//                             // The first frame after finished delay time
//                             //  We need to init offsetPerMS
//                             property.offsetPerMS = (property.targetNumber - tween.target[property.key]) / tween.duration;
//                         }
//                         if (property.tweenTime && tween.easeFunc) {
//                             //easing  moving
//                             const k = (property.tweenTime - tween.duration) / property.tweenTime;
//                             const coeff = tween.easeFunc(k);
//                             tween.target[property.key] = property.origin + (property.targetNumber - property.origin) * coeff;
//                         } else {
//                             tween.target[property.key] += property.offsetPerMS * dt;
//                         }
//                     });
//                     if (!tween.isStarted) {
//                         tween.isStarted = true;
//                         tween.startedEvent && tween.startedEvent();
//                     }
//                     tween.updatedEvent && tween.updatedEvent(dt);
//                 }
//             }
//         }
//     }

//     private static _tweenActionMap: Map<string, TwAction> = new Map<string, TwAction>();

//     /**
//      * Add a tween action to global pool and proceed automatically depend on delay time
//      * @param target target object
//      * @param endValues numberic values need to tween to
//      * @param duration duration of tween in milisecond
//      * @param delay delay time before tween start in milisecond
//      * @param finishedEvent will be called when the tween is finished
//      * @param updatedEvent call every frame after tween updated
//      */
//     public static to<T extends object>(
//         duration: number,
//         target: T,
//         endValues: Partial<NumericValues<T>>,
//         delay?: number,
//         finishedEvent?: Function,
//         updatedEvent?: Function,
//         startedEvent?: Function,
//     ): void {

//         const properties: IProperty[] = [];
//         const keys = Object.keys(endValues);
//         keys.forEach((key, idx) => {
//             properties.push({
//                 key: key,
//                 origin: target[key],
//                 targetNumber: endValues[key],
//                 offsetPerMS: (delay && delay > 0) ? undefined : (endValues[key] - target[key]) / duration
//             });
//         });

//         Tween.add(target, duration, properties, (delay) ? delay : 0, finishedEvent, updatedEvent, startedEvent);
//     }

//     /**
//      * Add a tween action to global pool and proceed automatically depend on delay time
//      * @param target target object
//      * @param endValues numberic values need to tween to
//      * @param duration duration of tween in milisecond
//      * @param delay delay time before tween start in milisecond
//      * @param finishedEvent will be called when the tween is finished
//      * @param updatedEvent call every frame after tween updated
//      * @param easeFunc easing function effect of moving
//      */
//     public static easeTo<T extends object>(
//         duration: number,
//         target: T,
//         endValues: Partial<NumericValues<T>>,
//         delay?: number,
//         finishedEvent?: Function,
//         updatedEvent?: Function,
//         easeFunc?: Function,
//         startedEvent?: Function,
//     ): void {

//         const properties: IProperty[] = [];
//         const keys = Object.keys(endValues);
//         keys.forEach((key, idx) => {
//             properties.push({
//                 key: key,
//                 origin: target[key],
//                 targetNumber: endValues[key],
//                 offsetPerMS: (delay && delay > 0) ? undefined : (endValues[key] - target[key]) / duration,
//                 tweenTime: duration
//             });
//         });

//         Tween.add(target, duration, properties, (delay) ? delay : 0, finishedEvent, updatedEvent, startedEvent, easeFunc);
//     }

//     /**
//      * Add a tween action to global pool and proceed automatically depend on delay time
//      * @param target target object
//      * @param endValues numberic values need to add or minus
//      * @param duration duration of tween in milisecond
//      * @param delay delay time before tween start in milisecond
//      * @param finishedEvent will be called when the tween is finished
//      * @param updatedEvent call every frame after tween updated
//      */
//     public static by<T extends object>(
//         duration: number,
//         target: T,
//         endValues: Partial<NumericValues<T>>,
//         delay?: number,
//         finishedEvent?: Function,
//         updatedEvent?: Function,
//         startedEvent?: Function,
//     ): void {

//         const properties: IProperty[] = [];
//         const keys = Object.keys(endValues);
//         keys.forEach((key, idx) => {
//             properties.push({
//                 key: key,
//                 origin: target[key],
//                 targetNumber: target[key] + endValues[key],
//                 offsetPerMS: (delay && delay > 0) ? undefined : (endValues[key] - target[key]) / duration
//             });
//         });

//         Tween.add(target, duration, properties, (delay) ? delay : 0, finishedEvent, updatedEvent, startedEvent);
//     }

//     /**
//      * Stop all current registered tweens
//      */
//     public static stopAll(): void {
//         this._tweenActionMap.clear();
//     }

//     /**
//      * Stop all tweens for given object that registered
//      * @param target target object contain numberic values
//      */
//     public static stopTweenFor(target: object): void {

//         for (const [key, tween] of this._tweenActionMap) {
//             if (tween.target === target) {
//                 this._tweenActionMap.delete(key);
//             }
//         }
//     }

//     public static stopTweenAndCallbackFor(target: object): void {
//         for (const [key, tween] of this._tweenActionMap) {
//             if (tween.target === target) {
//                 this._tweenActionMap.delete(key);
//                 if (tween.finishedEvent) {
//                     tween.finishedEvent();
//                 }
//             }
//         }
//     }

//     private static add(target: object, duration: number, values: IProperty[], delay: number, finishedEvent: Function, updatedEvent: Function, startedEvent: Function, easeFunc: Function = null) {
//         const uuid = _Math.shortUuidv4();

//         const tween: TwAction = {
//             target: target,
//             duration: duration,
//             values: values,
//             delay: delay,
//             isStarted: false,
//             finishedEvent: finishedEvent,
//             updatedEvent: updatedEvent,
//             startedEvent: startedEvent,
//             easeFunc: easeFunc,
//         };
//         this._tweenActionMap.set(uuid, tween);
//     }

//     public static setScaleTime(value: number) {
//         this._scaleTime = value;
//     }

//     public static getScaleTime(): number {
//         return this._scaleTime;
//     }

//     public static destroy() {
//         this._tweenActionMap.clear();
//     }
// }