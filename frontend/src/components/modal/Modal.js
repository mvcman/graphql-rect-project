import React from "react"
import "./modal.css"

export default function Modal(props){
    return (
        <div className="modal">
            <header className="modal__header">
                <h3>{props.title}</h3>
            </header>
            <section className="modal__content">
                {props.children}
            </section>
            <section className="modal__action">
                <button onClick={() => props.oncancel()}>Cancel</button>
                <button onClick={() => props.onconfirm()}>{props.confirmText}</button>
            </section>
        </div>
    );
}