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

    useEffect(() => {
        const formSelector = ".form-control[type='text']";

        const handleFocus = (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            if (target.matches(formSelector)) {
                setContainer(target.parentElement);
            }
        };

        const handleBlur = (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            if (target.matches(formSelector) && event.relatedTarget) {
                setContainer(null);
            }
        };

        document.addEventListener('focusin', handleFocus, true);
        document.addEventListener('focusout', handleBlur, true);

        return () => {
            document.removeEventListener('focusin', handleFocus, true);
            document.removeEventListener('focusout', handleBlur, true);
        };
    }, []);

    if (!container) return null;

    return (
      <Portal container={container}>
          <div className={s.mathInput}>
              <EditableMathField
                latex={latex}
                onChange={(mathField) => {
                    setLatex(mathField.latex());
                }}
              />
              <p>{latex}</p>
          </div>
      </Portal>
    );
};

export default MathInput;
