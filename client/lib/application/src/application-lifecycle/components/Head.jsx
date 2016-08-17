import React from 'react';
import Icon from 'react-fa';
import { Link } from 'react-router';
import * as Routes from 'application/src/routes';

const Head = (props) => {
    return (
        <div>
            <h2>
                <Link
                    to = {Routes.appDetail(props.linkParams)}>
                    {props.application}'s
                </Link> application lifecycle
            </h2>
            <div className='btn-group'>
                <Link
                    to         = {Routes.appDetail(props.linkParams)}
                    className  = 'btn btn-default'>
                    <Icon name = 'chevron-left' /> {props.application}
                </Link>
            </div>
        </div>
    );
};

Head.displayName = 'application-lifecycle-header';

Head.propTypes = {
    application: React.PropTypes.string.isRequired,
    linkParams: React.PropTypes.shape({
        applicationId: React.PropTypes.string
    }).isRequired
};

export default Head;