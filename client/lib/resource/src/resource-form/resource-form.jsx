import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'resource/src/routes';
import Markdown from 'common/src/markdown.jsx';
import 'common/asset/less/resource/resource-form.less';

class ResourceForm extends React.Component {
    constructor(props) {
        super();
        let {edit, resourceId} = props;
        this.state = {
            resource: edit ? props.essentialsStore.getResource(resourceId) : {resource_owners: []}
        };
    }

    setCustomValidity(evt) {
        ReactDOM.findDOMNode(evt.target).setCustomValidity(
            this.state.resourceIdTaken ?
                'Resource ID is already taken' :
                '');
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

    update(field, prop, evt) {
        this.state.resource[field] = evt.target[prop];
        this.setState({
            resource: this.state.resource,
            resourceIdTaken: this.props.essentialsStore.getResource(this.state.resource.id) !== false
        });
    }

    render() {
        let {edit, resourceId} = this.props,
            {resourceIdTaken, resource} = this.state;
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
                                    {resourceIdTaken && !edit ?
                                        <Icon
                                            data-block='taken-symbol'
                                            title='Resource ID is already taken.'
                                            className='is-taken'
                                            name='close'
                                            fixedWidth />
                                        :
                                        <Icon
                                            data-block='available-symbol'
                                            title='Resource ID is available.'
                                            className='is-available'
                                            name='check'
                                            fixedWidth />}
                                </div>
                                <input
                                        id='resource_id'
                                        autoFocus='autofocus'
                                        value={resource.id}
                                        onChange={this.update.bind(this, 'id', 'value')}
                                        onKeyUp={this.setCustomValidity.bind(this)}
                                        disabled={edit}
                                        pattern='[a-z][a-z0-9-_]*[a-z0-9]'
                                        title='Only lowercase characters with underscores in between.'
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
