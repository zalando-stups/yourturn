import React from 'react';
import Icon from 'react-fa';

export default function ViolationViz({priority}) {
    let all = [];
    switch (priority) {
        case 1: all = [1, 1, 1]; break;
        case 2: all = [1, 1, 0]; break;
        case 3: all = [1, 0, 0]; break;
        case 4: all = [0, 0, 0]; break;
    }
    return <span className='violationViz' data-priority={priority} title={`Priority: ${priority}`}>
            {all.map((c, i) => c > 0 ?
                            <Icon key={i} name='circle' /> :
                            <Icon key={i} name='circle-thin' />)}
            </span>;
}

ViolationViz.displayName = 'ViolationViz';