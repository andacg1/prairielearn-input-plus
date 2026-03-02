import { useCallback, useEffect, useRef, useState } from "react";
import { MQtoAM } from "./AMtoMQ.ts";
import s from "./MathInput.module.css";
import Portal from "@mui/material/Portal";
import { addStyles, EditableMathField } from "react-mathquill";
import asciiTolatex from 'asciimath-to-latex'
import "./global.css"

addStyles();

const MathInput = () => {
    const formSelector = ".form-control[type='text']";
    const [latex, setLatex] = useState("\\frac{1}{\\sqrt{2}}\\cdot 2");
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const [, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const updateValue = useCallback((newValue: string) => {
        (container?.querySelector(formSelector) as HTMLInputElement).value = MQtoAM(newValue, true);
    }, [container])

    useEffect(() => {
        const handleFocus = (event: FocusEvent) => {
            const target = event.target as HTMLInputElement;
            // console.log("focus", container, relatedTarget);
            if (target.matches(formSelector) && !container?.contains(target)) {
                setContainer(target.parentElement);
                setLatex(asciiTolatex(target.value));

                // Calculate position relative to viewport
                const rect = target.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            }
        };

        const handleBlur = (event: FocusEvent) => {
            const relatedTarget = event.relatedTarget as HTMLElement;
            // console.log(container, relatedTarget);

            if (!container?.contains(relatedTarget) || !relatedTarget) {
                setContainer(null);
            }

        };

        document.addEventListener('focusin', handleFocus, true);
        document.addEventListener('focusout', handleBlur, true);

        return () => {
            document.removeEventListener('focusin', handleFocus, true);
            document.removeEventListener('focusout', handleBlur, true);
        };
    }, [container]);

    if (!container) return null;

    return (
      <Portal container={container}>
          <div className={s.mathInput}
               id="math-input-container"
               ref={containerRef}
               style={{
                   position: "absolute",
                   zIndex: 99999999,
                   overflow: "visible",
                   top: "100%",
                   backgroundColor: "white",
                   padding: "0.2em"
               }}>
              <EditableMathField
                mathquillDidMount={(mathField) => {
                    // console.log("MathField mounted", mathField);
                    mathField.focus();
                    Object.assign(mathField.el().style, {padding: "0.5em"})
                    mathField.el().scrollIntoView({
                        // container: "nearest",
                        behavior: "instant",

                    });
                }}
                latex={latex}
                onChange={(mathField) => {
                    setLatex(mathField.latex());
                    updateValue(mathField.latex());
                }}

                autoFocus={true}
              />
          </div>
      </Portal>
    );
};

export default MathInput;
