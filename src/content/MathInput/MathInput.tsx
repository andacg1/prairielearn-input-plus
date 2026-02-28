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
    return (
      <Portal container={() => document.querySelector(".form-control[type='text']:focus")?.parentElement || null}>
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
