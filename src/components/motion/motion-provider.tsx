"use client";
import { LazyMotion,MotionConfig } from "motion/react";
import type { ReactNode } from "react";
const features=()=>import('./motion-features').then(module=>module.default);
export function MotionProvider({children}:{children:ReactNode}){return <LazyMotion features={features} strict><MotionConfig reducedMotion="user">{children}</MotionConfig></LazyMotion>;}
