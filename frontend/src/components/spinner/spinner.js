import React from 'react'

import "./spinner.css"

const spinner = () =>
    (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {/* <div class="lds-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div> */}
        <div class="lds-dual-ring"></div>
    </div>);

export default spinner;