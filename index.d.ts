import { ActionResult, ActionType, ActionsType, VNode, View } from 'hyperapp'

export as namespace hyperapp__fx

// hyperapp

export interface App {
    <State, Actions>(
        state: State,
        actions: ActionsType<State, Actions>,
        view: View<State, Actions>,
        container: Element | null,
    ): Actions
}

// @hyperapp/fx

export type EffectTuple = [string, object]

export type Effect = EffectTuple | Array<EffectTuple>

export type Action = (name: string, data?: any) => EffectTuple

export type EffectsConfig = {
    [effectName: string]: (props: object, getAction: (name: string) => Action) => undefined
}

export function withFx(fxOrApp: EffectsConfig | App): App

export function action(name: string, data?: any): EffectTuple

export function frame(action: string): EffectTuple

export function delay(duration: number, action: string, data?: any): EffectTuple

export function time(action: string): EffectTuple

export function log(...args: Array<any>): EffectTuple

export function http(url: string, action: string, options?: object): EffectTuple

export function event(action: string): EffectTuple

export function keydown(action: string): EffectTuple

export function keyup(action: string): EffectTuple

export function random(action: string, min?: number, max?: number): EffectTuple

export function debounce(wait: number, action: string, data?: any): EffectTuple

export function throttle(rate: number, action: string, data?: any): EffectTuple

export type EffectConditional = [boolean, EffectTuple]

export function fxIf(conditionals: Array<EffectConditional>): Array<EffectTuple>
