import React, { Component } from 'react'

export class Table extends Component {

    render() {
        const { list } = this.props

        return (
            <div className="table">
                {list.map(item => 
                <div className="table-row">
                        <span style={{width: '30%'}}><a href={item.url}>{item.author}</a></span>
                        <span style={{width: '30%'}}>{item.created_at.split('T')[0]}</span>
                        <span style={{width: '30%'}}>IP: {item.created_at_i}</span>
                </div>
                )}
            </div>
        )
    }
}

export default Table