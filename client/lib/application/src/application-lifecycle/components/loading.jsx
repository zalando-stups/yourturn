import React from 'react';
import ThreeColumns from 'common/components/pure/ThreeColumns.jsx';

const Loading = () => {
    return (
        <ThreeColumns
            leftChildren   = {<div></div>}
            middleChildren = {<div><Icon pulse size='5x' name="spinner" /> Loading</div>}
            rightChildren  = {<div></div>}
        />
    )
};

Loading.displayName = 'Loading';

export default Loading;