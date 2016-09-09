import React from 'react';
import Icon from 'react-fa';
import Spinner from 'common/src/components/pure/Spinner.jsx';

import Conditional from 'common/src/components/pure/ConditionalHOC.jsx';

// Functions
const iconNameByRepo = function (url) {
    if (!url) {
        return '';
    }
    if (url.includes('stash')) {
        return 'external-link-square';
    }
    if (url.includes('github.bus.zalan.do')) {
        return 'github-square';
    }
    return 'github';
};

const isKioLoading = props => props.application['status'] && props.application['status'] == 'PENDING';

// Simple Components

const ScmDisplay = props =>
    <div>
        <a className='btn btn-default btn-small'
           href={props.application.scm_url}>
            <Icon name={iconNameByRepo(props.application.scm_url)} />
        </a> SCM
    </div>;
ScmDisplay.displayName = 'ScmDisplay';
ScmDisplay.propTypes = {
    application: React.PropTypes.shape({
        scm_url: React.PropTypes.string
    }).isRequired
};

const ServiceDisplay = props =>
    <div>
        <a className='btn btn-default btn-small'
           href={props.application.service_url}>
            <Icon name='external-link-square' />
        </a> Service
    </div>;

ServiceDisplay.displayName = 'ServiceDisplay';
ServiceDisplay.propTypes = {
    application: React.PropTypes.shape({
        service_url: React.PropTypes.string
    }).isRequired
};

/*eslint-disable react/display-name */
const NotAvailable = displayString => () => <div><Icon name='icon-frown' />{displayString} n/a</div>;
const Loading = displayString => () => <div><Spinner />{displayString}</div>;
/*eslint-enable react/display-name */

// HOC'ified Components

const ScmAvailable = Conditional(props => !!props.application.scm_url,
    ScmDisplay, NotAvailable('SCM'));
const ServiceAvailable = Conditional(props => !!props.application.service_url,
    ServiceDisplay, NotAvailable('Service'));

const ScmShortCut     = Conditional(props => isKioLoading(props), Loading('SCM'), ScmAvailable);
const ServiceShortCut = Conditional(props => isKioLoading(props), Loading('Service'), ServiceAvailable);


export {
    ScmShortCut,
    ServiceShortCut
}