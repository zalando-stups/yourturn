import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'resource/src/routes';
import Markdown from 'common/src/markdown.jsx';
import 'common/asset/less/resource/resource-form.less';

// this is ugly...
function setCustomValidity(message) {
    document.getElementById('resource_id').setCustomValidity(message);
}

class ResourceForm extends React.Component {
    constructor(props) {
        super();
        let {edit, resourceId} = props;
        this.state = {
            resource: edit ? props.resource : {resource_owners: []},
            checkingId: false,
            invalidIdReason: ''
        };
    }

    updateResourceOwner(owner) {
        let idx = this.state.resource.resource_owners.indexOf(owner);
        if (idx >= 0) {
            this.state.resource.resource_owners.splice(idx, 1);
        } else {
            this.state.resource.resource_owners.push(owner);
        }
        this.setState({
            resource: this.state.resource
        });
    }

    save(evt) {
        evt.preventDefault();

        let {resource} = this.state;
        // save the resource
        this.props.essentialsActions
        .saveResource(resource.id, resource)
        // redirect to detail view of the resource
        .then(() => this.context.router.push(Routes.resDetail({resourceId: resource.id})))
        .catch(err => {
            this.props.notificationActions
            .addNotification(
                `Could not save resource ${resource.name}. ${err.message}`,
                'error'
            );
        });
    }

    checkIfIdInvalid() {
        if (this.state.checkingId) {
            // request to kio in flight
            // wait until done
            _.defer(this.checkIfIdInvalid.bind(this), arguments);
            return;
        }
        // check if there already a resource with thid id
        if (this.props.resources.some(r => r.id === this.state.resource.id)) {
            const invalidReason = 'Resource ID already taken.';
            this.setState({
                invalidIdReason: invalidReason,
                checkingId: false
            });
            setCustomValidity(invalidReason);
            return;
        }
        // check if first part before dot is an app and belongs to correct team
        const APP_REGEX = /^([a-z][a-z\-]+[a-z])(\..+)?/,
              match = this.state.resource.id.match(APP_REGEX);
        // at least the regex matches
        if (match) {
            const app_id = match[1];
            this.setState({ checkingId: true });
            // fetching team
            this.props.kioActions.fetchApplication(app_id)
            .then(({team_id, id}) => {
                // maybe id is already different than what's in the form
                if (id !== this.state.resource.id) {
                    return;
                }

                // check if team_id is in userAccounts
                const ownApp = this.props.userAccounts.indexOf(team_id) >= 0,
                      invalidReason = `Application ${app_id} is not yours. (Team: ${team_id})`;
                this.setState({
                    invalidIdReason: ownApp ?
                                        '' :
                                        invalidReason,
                    checkingId: false
                });
                if (ownApp) {
                    setCustomValidity('');
                } else {
                    setCustomValidity(invalidReason);
                }
            })
            .catch(e => {
                // app does not exist or kio is down, so fall back to whitelisting
                const invalidReason = 'Not a whitelisted user.';
                this.setState({
                    checkingId: false,
                    invalidIdReason: this.props.isUserWhitelisted ? '' : invalidReason
                });
                if (this.props.isUserWhitelisted) {
                    setCustomValidity('');
                } else {
                    setCustomValidity(invalidReason);
                }
            });
        }
    }

    update(field, prop, evt) {
        this.state.resource[field] = evt.target[prop];
        this.setState({resource: this.state.resource});
        if (field === 'id') {
            this.checkIfIdInvalid();
        }
    }

    render() {
        let {edit, resourceId} = this.props,
            {invalidIdReason, resource, checkingId} = this.state;
        const LINK_PARAMS = {
            resourceId: resourceId
        };
        return <div className='resourceForm'>
                    <h2>
                        {edit ?
                            <span>Edit <Link to={Routes.resDetail(LINK_PARAMS)}>{resource.name}</Link></span>
                            :
                            <span>Create a new <Link to={Routes.resList(LINK_PARAMS)}>Resource Type</Link></span>}
                    </h2>
                    <div className='btn-group'>
                        {edit ?
                            <Link
                                to={Routes.resDetail(LINK_PARAMS)}
                                className='btn btn-default'>
                                <Icon name='chevron-left' /> {resource.name}
                            </Link>
                            :
                            <Link
                                to={Routes.resList(LINK_PARAMS)}
                                className='btn btn-default'>
                                <Icon name='chevron-left' /> Resource Types
                            </Link>}
                    </div>
                    <form
                        data-block='form'
                        onSubmit={this.save.bind(this)}
                        className='form'
                        name='resourceForm'>
                        <div className='form-group'>
                            <label htmlFor='resource_id'>Resource Type ID</label>
                            <small>The ID of the resource type</small>
                            <div className='input-group'>
                                <div className='input-addon'>
                                    <Icon
                                        data-block='symbol'
                                        title={invalidIdReason || 'Resource ID is valid.'}
                                        className={invalidIdReason ? 'is-taken' : 'is-valid'}
                                        name={checkingId ?
                                                'refresh' :
                                                invalidIdReason ?
                                                    'close' :
                                                    'check'}
                                        spin={checkingId}
                                        fixedWidth />
                                </div>
                                <input
                                    id='resource_id'
                                    autoFocus='autofocus'
                                    value={resource.id}
                                    onChange={this.update.bind(this, 'id', 'value')}
                                    disabled={edit}
                                    pattern='[a-z][a-z0-9-_]*(?:\.[a-z0-9-_]*)?[a-z0-9]'
                                    title='Only lowercase characters, at most one dot and any hyphens or underscores.'
                                    name='yourturn_resource_id'
                                    data-block='id-input'
                                    required={true}
                                    placeholder='sales_order'
                                    type='text' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='resource_name'>Resource Type Name</label>
                            <small>The name of the resource type</small>
                            <input
                                id='resource_name'
                                value={resource.name}
                                onChange={this.update.bind(this, 'name', 'value')}
                                name='yourturn_resource_name'
                                data-block='name-input'
                                required={true}
                                placeholder='Sales Order'
                                type='text' />
                        </div>
                        <div className='form-group'>
                            <label>Resource Owner</label>
                            <small>Who owns the resource? Who can grant access to the resource? For now it’s okay to not have any resource owner.</small>
                            <label htmlFor='employees'>
                                <input
                                    checked={resource.resource_owners.indexOf('employees') >= 0}
                                    name='yourturn_resource_owner_employee'
                                    onChange={this.updateResourceOwner.bind(this, 'employees')}
                                    id='employees'
                                    type='checkbox' /> Employees
                            </label>
                            <label htmlFor='services'>
                                <input
                                    checked={resource.resource_owners.indexOf('services') >= 0}
                                    name='yourturn_resource_owner_application'
                                    onChange={this.updateResourceOwner.bind(this, 'services')}
                                    id='services'
                                    type='checkbox' /> Services
                            </label>
                            <label className='form-disabled' htmlFor='customer'>
                                <input
                                    disabled={true}
                                    name='yourturn_resource_owner_customer'
                                    id='customers'
                                    type='checkbox' /> Customers (available later this year)
                            </label>
                            <label className='form-disabled' htmlFor='brands'>
                                <input
                                    disabled={true}
                                    name='yourturn_resource_owner_brands'
                                    id='brands'
                                    type='checkbox' /> Brands (available later this year)
                            </label>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='resource_description'>Resource Type Description</label>
                            <small>An elaborate description with examples of what kind of data this resource type includes. You can use <a href='http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html'>Markdown</a>.</small>
                            <Markdown
                                editable={true}
                                src={resource.description}
                                onChange={this.update.bind(this, 'description', 'value')} />
                        </div>
                        <div className='btn-group'>
                            <button
                                type='submit'
                                className='btn btn-primary'>
                                <Icon name='save' /> Save
                            </button>
                        </div>
                    </form>

                </div>;
    }
}
ResourceForm.displayName = 'ResourceForm';
ResourceForm.propTypes = {
    edit: React.PropTypes.bool.isRequired,
    resourceId: React.PropTypes.string,
    essentialsStore: React.PropTypes.object.isRequired,
    essentialsActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired
};
ResourceForm.contextTypes = {
    router: React.PropTypes.object
};

export default ResourceForm;
