import React from 'react';
import Icon from 'react-fa';
const MAX_VALUE = 4;

export default function ViolationViz({severity}) {
    const all = new Array(severity).fill(1).concat(new Array(MAX_VALUE - severity).fill(0));
    return <span title={`Criticality: ${severity}`}>
            {all.map(c => c > 0 ?
                            <Icon name='circle' /> :
                            <Icon name='circle-thin' />)}
            </span>;
}
