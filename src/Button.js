import React, { Component } from 'react'

export class Button extends Component {

    render() {
        const { children, onClick } = this.props
        return (
            <button
                onClick={onClick}
                className="small-button-blue"
            >
                {children}
            </button>
        )
    }
}

export default Button