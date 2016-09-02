import React from 'react';
import ThreeColumns from 'common/src/components/pure/ThreeColumns.jsx';
import Spinner from 'common/src/components/pure/Spinner.jsx';

const Loading = () => {
    return (
        <ThreeColumns
            leftChildren   = {<div></div>}
            middleChildren = {<div><Spinner size = '5x' />Loading</div>}
            rightChildren  = {<div></div>}
        />
    )
};

Loading.displayName = 'Loading';

export default Loading;