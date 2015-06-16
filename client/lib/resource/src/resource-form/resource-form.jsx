import React from 'react';
import {Link} from 'react-router';
import {constructLocalUrl} from 'common/src/data/services';
import 'common/asset/less/resource/resource-form.less';

class ResourceForm extends React.Component {
    constructor(props) {
        super();
        let {edit, resourceId, flux} = props;
        this.stores = {
            essentials: flux.getStore('essentials')
        };
        this.actions = flux.getActions('essentials');
        this.state = {
            resource: edit ? this.stores.essentials.getResource(resourceId) : { resource_owners: [] }
        };
    }

    setCustomValidity(evt) {
        React.findDOMNode(evt.target).setCustomValidity(
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
        if (evt) {
            evt.preventDefault();
        }
        let {resource} = this.state;
        // save the resource
        this
        .actions
        .saveResource(resource.id, resource)
        .then(() => {
            // redirect to detail view of the resource
            this.context.router.transitionTo(constructLocalUrl('resource-type', [resource.id]));
        })
        .catch(err => {
            this
            .props
            .globalFlux
            .getActions('notification')
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
            resourceIdTaken: this.stores.essentials.getResource(this.state.resource.id) !== false
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
                            <span>Edit <Link to='resource-resDetail' params={LINK_PARAMS}>{resource.name}</Link></span>
                            :
                            <span>Create a new <Link to='resource-resList'>Resource Type</Link></span>}
                    </h2>
                    <div className='btn-group'>
                        {edit ?
                            <Link
                                to='resource-resDetail'
                                params={LINK_PARAMS}
                                className='btn btn-default'>
                                <i className='fa fa-chevron-left'></i> {resource.name}
                            </Link>
                            :
                            <Link
                                to='resource-resList'
                                className='btn btn-default'>
                                <i className='fa fa-chevron-left'></i> Resource Types
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
                                        <i data-block='taken-symbol'
                                            title='Resource ID is already taken.'
                                            className='fa fa-close fa-fw is-taken'></i>
                                        :
                                        <i data-block='available-symbol'
                                            title='Resource ID is available.'
                                            className='fa fa-check fa-fw is-available'></i>}
                                </div>
                                <input
                                        id='resource_id'
                                        autoFocus='autofocus'
                                        value={resource.id}
                                        onChange={this.update.bind(this, 'id', 'value')}
                                        onKeyUp={this.setCustomValidity.bind(this)}
                                        disabled={edit}
                                        pattern='[a-z][a-z_]*[a-z]'
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
                            <textarea
                                id='resource_description'
                                name='yourturn_resource_description'
                                value={resource.description}
                                onChange={this.update.bind(this, 'description', 'value')}
                                cols='30'
                                rows='10'></textarea>
                        </div>
                        <div className='btn-group'>
                            <button
                                type='submit'
                                className='btn btn-primary'>
                                <i className='fa fa-save'></i> Save
                            </button>
                        </div>
                    </form>

                </div>;
    }
}
ResourceForm.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ResourceForm;