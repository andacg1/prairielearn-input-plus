import { type ReactNode, useEffect, useRef, useState } from "react";
import s from "./MathInput.module.css";
import Portal from "@mui/material/Portal";
import { addStyles, EditableMathField } from "react-mathquill";

addStyles();

type MathInputProps = {
    children?: ReactNode
}

const MathInput = ({
    children
}: MathInputProps) => {
    const [latex, setLatex] = useState("\\frac{1}{\\sqrt{2}}\\cdot 2");
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const formSelector = ".form-control[type='text']";

        const handleFocus = (event: FocusEvent) => {
            const target = event.target as HTMLInputElement;
            const relatedTarget = event.relatedTarget as HTMLElement;
            console.log("focus", container, relatedTarget);
            if (target.matches(formSelector) && !container?.contains(target)) {
                setContainer(target.parentElement);
                setLatex(target.value);
            }
        };

        const handleBlur = (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            const relatedTarget = event.relatedTarget as HTMLElement;
            console.log(container, relatedTarget);

            if (!container?.contains(relatedTarget) || !relatedTarget) {
                // setContainer(null);
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
                   zIndex: 1000,
                   top: "100%",
                   backgroundColor: "white"
               }}>
              <EditableMathField
                mathquillDidMount={(mathField) => {
                    console.log("MathField mounted", mathField);
                    mathField.focus();
                }}
                latex={latex}
                onChange={(mathField) => {
                    setLatex(mathField.latex());
                }}

                autoFocus={true}
              />
              {/* <p>{latex}</p> */}
          </div>
      </Portal>
    );
};

export default MathInput;
