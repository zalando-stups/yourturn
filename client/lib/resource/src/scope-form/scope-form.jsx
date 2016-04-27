import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'resource/src/routes';
import Markdown from 'common/src/markdown.jsx';
import 'common/asset/less/resource/scope-form.less';

class ScopeForm extends React.Component {
    constructor(props) {
        super();
        let {resourceId, scopeId, edit, scope} = props;
        this.state = {
            scope: edit ? scope : { is_resource_owner_scope: false },
            scopeIdTaken: false
        };
    }

    update(field, prop, evt) {
        this.state.scope[field] = evt.target[prop];
        if (evt.target.id === 'scope_appScope') {
            this.state.scope[field] = !evt.target[prop];
        }
        this.setState({
            scope: this.state.scope,
            scopeIdTaken: this.props.scopes.indexOf(this.state.scope.id) !== -1
        });
    }

    setCustomValidity(evt) {
        ReactDOM.findDOMNode(evt.target).setCustomValidity(
            this.state.scopeIdTaken ?
                'Scope ID is already taken' :
                '');
    }

    save(evt) {
        evt.preventDefault();

        let {resourceId, resource} = this.props,
            {scope} = this.state;

        // send it off to the store
        this.props.essentialsActions
        .saveScope(resourceId, scope.id, scope)
        // redirect back to the resource detail view
        .then(() => this.context.router.push(Routes.resDetail({ resourceId})))
        .catch(() => {
            let verb = this.props.edit ? 'update' : 'create';
            this.props.notificationActions
            .addNotification(
                `Could not ${verb} scope ${scope.id} for resource ${resource.name}.`,
                'error'
            );
        });
    }

    render() {
        let {edit, scopeId, resourceId, resource} = this.props,
            {scope, scopeIdTaken} = this.state;
        const LINK_PARAMS = {
            resourceId: resourceId,
            scopeId: scopeId
        };
        return <div className='scopeForm'>
                    <h2>
                        {edit ?
                            <span>Edit <Link
                                            to={Routes.resDetail(LINK_PARAMS)}>
                                            {resource.id || resourceId}
                                        </Link>.<Link
                                            to={Routes.scpDetail(LINK_PARAMS)}>
                                            {scope.id || scopeId}
                                        </Link>
                            </span>
                            :
                            <span>Create new scope for <Link
                                                            to={Routes.resDetail(LINK_PARAMS)}>
                                                            {resource.id || resourceId}
                                                        </Link>
                            </span>}
                    </h2>
                    <div className='btn-group'>
                        {edit ?
                            <Link
                                to={Routes.scpDetail(LINK_PARAMS)}
                                className='btn btn-default'>
                                <Icon name='chevron-left' /> {resource.id}.{scope.id}
                            </Link>
                            :
                            <Link
                                to={Routes.resDetail(LINK_PARAMS)}
                                className='btn btn-default'>
                                <Icon name='chevron-left' /> {resource.name}
                            </Link>}
                    </div>
                    <form
                        onSubmit={this.save.bind(this)}
                        className='form'>
                        <div className='form-group'>
                            <label htmlFor='scope_id'>Scope ID</label>
                            <small>The ID of the scope.</small>
                            <div className='input-group'>
                                <div className='input-addon'>
                                    {scopeIdTaken && !edit ?
                                        <Icon
                                            data-block='taken-symbol'
                                            title='Scope ID is already taken.'
                                            className='is-taken'
                                            name='close'
                                            fixedWidth />
                                        :
                                        <Icon
                                            data-block='available-symbol'
                                            title='Scope ID is available.'
                                            className='is-available'
                                            name='check'
                                            fixedWidth />}
                                </div>
                                <input
                                    id='scope_id'
                                    name='yourturn_scope_id'
                                    title='Only characters with underscores in between.'
                                    autoFocus={true}
                                    required={true}
                                    onKeyUp={this.setCustomValidity.bind(this)}
                                    pattern='[a-z][a-z0-9-_]*[a-z0-9]'
                                    placeholder='read'
                                    disabled={edit}
                                    value={scope.id}
                                    onChange={this.update.bind(this, 'id', 'value')}
                                    type='text' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='scope_summary'>Summary</label>
                            <small>A few words on what the scope grants.</small>
                            <input
                                name='yourturn_scope_summary'
                                id='scope_summary'
                                maxLength='140'
                                value={scope.summary}
                                onChange={this.update.bind(this, 'summary', 'value')}
                                type='text' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='scope_summary'>User Information</label>
                            <small>This will be shown to the user on the consent screen. “The application would like to…”</small>
                            <input
                                name='yourturn_scope_information'
                                id='scope_information'
                                maxLength='140'
                                onChange={this.update.bind(this, 'user_information', 'value')}
                                value={scope.user_information}
                                type='text' />
                        </div>
                        <div className='form-group with-long-text'>
                            <label>Scope Type</label>
                            <small>Which of these scope types applies?</small>
                            <div className='grid'>
                                <div className='grid-col'>
                                    <label>
                                        <input
                                            id='scope_ownerScope'
                                            required={true}
                                            disabled={resource.resource_owners && !resource.resource_owners.length}
                                            value='scope_ownerScope'
                                            name='yourturn_scope_scopeType'
                                            onChange={this.update.bind(this, 'is_resource_owner_scope', 'checked')}
                                            checked={scope.is_resource_owner_scope}
                                            type='radio' /> Resource Owner Scope
                                    </label>
                                </div>
                                {resource.resource_owners && resource.resource_owners.length ?
                                    <div className='grid-col'>
                                        <p>
                                            <small>
                                                {resource.resource_owners.map(
                                                    (owner, i, all) => <span key={i}>
                                                                            <strong>{owner}</strong>
                                                                            {i === all.length - 1 ? '' : ', '}
                                                                        </span>)} can grant <strong>{scope.id}</strong> access on his <strong>{resource.name}</strong> data to applications.
                                            </small>
                                        </p>
                                        <p>
                                            <small>A Resource Owner Scope can be granted by the resource owners to others. The resource owner automatically has the permission to grant this scope without further actions. Resource Owner Scopes always authorize only in the context of the resource owner’s resources.</small>
                                        </p>
                                        <p>
                                            <small>For instance: A customer can grant an application <strong>read</strong> access to <strong>his</strong> sales order data.</small>
                                        </p>
                                    </div>
                                    :
                                    <div className='grid-col'>
                                        <p>
                                            <small>Nobody owns {resource.name}</small>
                                        </p>
                                    </div>}
                            </div>
                            <div className='grid'>
                                <div className='grid-col'>
                                    <label htmlFor='scope_appScope'>
                                        <input
                                            id='scope_appScope'
                                            value='scope_appScope'
                                            name='yourturn_scope_scopeType'
                                            checked={!scope.is_resource_owner_scope}
                                            onChange={this.update.bind(this, 'is_resource_owner_scope', 'checked')}
                                            data-block='appscope-checkbox'
                                            type='radio' /> Application Scope
                                    </label>
                                </div>
                                <div className='grid-col'>
                                    <p>
                                        <small>An application can get <strong>{scope.id}</strong> access to <strong>{resource.name}</strong> data.</small>
                                    </p>
                                    <p>
                                         <small>Normally Application Scopes are not bound to the context of a resource owner. By default neither applications nor resource owners have this scope. It has to be assigned manually in an application’s OAuth configuration.</small>
                                    </p>
                                    <p>
                                        <small>For instance: An analytics application can get <strong>read_all</strong> access to all sales order data without consent of the resource owners.</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='scope_description'>Scope Description</label>
                            <small>An elaborate description. You can use <a href='http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html'>Markdown</a>.</small>
                            <Markdown
                                editable={true}
                                src={scope.description}
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
ScopeForm.displayName = 'ScopeForm';
ScopeForm.propTypes = {
    scopeId: React.PropTypes.string,
    resourceId: React.PropTypes.string.isRequired,
    edit: React.PropTypes.bool.isRequired,
    essentialsActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired,
};
ScopeForm.contextTypes = {
    router: React.PropTypes.object
};

export default ScopeForm;