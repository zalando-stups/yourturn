import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'react-fa';
import Markdown from 'common/src/markdown.jsx';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import SERVICE_URL_TLD from 'SERVICE_URL_TLD';
import 'common/asset/less/application/application-form.less';

class ApplicationForm extends React.Component {
    constructor(props) {
        super();
        let cloudAccounts = props.userStore.getUserCloudAccounts();
        this.state = {
            autocompleteServiceUrl: true
        };
        if (props.edit) {
            let app = props.kioStore.getApplication(props.applicationId);
            app.service_url = app.service_url && app.service_url.indexOf('https://') === 0 ?
                                app.service_url.substring('https://'.length) :
                                app.service_url;
            this.state.app = app;
        } else {
            this.state.app = {
                active: true,
                criticality_level: 2,
                publicly_accessible: false,
                team_id: cloudAccounts.length ? cloudAccounts[0].name : undefined
            };
        }
    }

    disableAutocomplete() {
        this.setState({
            autocompleteServiceUrl: false
        });
    }

    setCustomValidity(evt) {
        ReactDOM
        .findDOMNode(evt.target)
        .setCustomValidity(this.state.appIdTaken ? 'Application ID is already taken' : '');
    }

    /**
     * Saves the application to kio.
     */
    save(evt) {
        evt.preventDefault();

        let {app} = this.state;

        app.service_url = app.service_url ? 'https://' + app.service_url : '';

        this.props.kioActions
        .saveApplication(this.state.app.id, this.state.app)
        .then(() => this.context.router.push(Routes.appDetail({applicationId: this.state.app.id})))
        .catch(e => {
            let verb = this.props.edit ? 'update' : 'create';
            this.props.notificationActions
            .addNotification(
                `Could not ${verb} application ${app.name}. (${e.message})`,
                'error'
            );
        });
    }

    update(field, prop, evt) {
        if (field === 'criticality_level') {
            this.state.app[field] = parseInt(evt.target[prop], 10);
        } else {
            this.state.app[field] = evt.target[prop];
        }
        if (!this.props.edit && this.state.autocompleteServiceUrl) {
            this.state.app.service_url = `${this.state.app.id || 'app'}.${this.state.app.team_id}.${SERVICE_URL_TLD}`;
        }
        this.setState({
            app: this.state.app,
            appIdTaken: this.props.kioStore.getApplication(this.state.app.id) !== false
        });
    }

    render() {
        let {edit, applicationId} = this.props,
            storeApp = this.props.kioStore.getApplication(applicationId),
            {app} = this.state,
            accounts = this.props.userStore.getUserCloudAccounts();
        const LINK_PARAMS = {applicationId};
        return <div className='applicationForm'>
                    {edit ?
                        <div>
                            <h2>Edit <Link
                                        to={Routes.appDetail(LINK_PARAMS)}>{storeApp.name}</Link>
                            </h2>
                            <div className='btn-group'>
                                <Link
                                    to={Routes.appDetail(LINK_PARAMS)}
                                    className='btn btn-default'>
                                    <Icon name='chevron-left' /> {storeApp.name}
                                </Link>
                            </div>
                        </div>
                        :
                        <div>
                            <h2>Create a new <Link to={Routes.appList()}>Application</Link></h2>
                            <div className='btn-group'>
                                <Link
                                    to={Routes.appList()}
                                    className='btn btn-default'>
                                    <Icon name='chevron-left' /> Applications
                                </Link>
                            </div>
                        </div>}
                    <form
                        data-block='form'
                        className='form'
                        onSubmit={this.save.bind(this)}
                        name='createAppForm'>

                        <div className='form-group'>
                            <label htmlFor='active'>
                                <input
                                    id='active'
                                    data-block='active-checkbox'
                                    name='yourturn_app_active'
                                    checked={app.active}
                                    onChange={this.update.bind(this, 'active', 'checked')}
                                    type='checkbox' /> Active application
                            </label>
                            <small>Inactive applications cannot obtain OAuth credentials.</small>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='is-public'>
                                <input
                                    id='is-public'
                                    data-block='is-public-checkbox'
                                    name='yourturn_app_active'
                                    checked={app.publicly_accessible}
                                    onChange={this.update.bind(this, 'publicly_accessible', 'checked')}
                                    type='checkbox' /> Is accessible without OAuth credentials
                            </label>
                            <small>If this application is meant to be publicly available on its root path (like YOUR TURN), i.e. does not return an error on <code>GET /</code>.</small>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='team_id'>Team ID</label>
                            <small>The ID of the owning team.</small>
                            {accounts.length ?
                                <select
                                    data-block='team-input'
                                    name='yourturn_app_team_id'
                                    defaultValue={app.team_id || accounts[0].name}
                                    onChange={this.update.bind(this, 'team_id', 'value')}
                                    id='team_id'>
                                    {accounts.map(
                                        a => <option
                                                key={a.name}
                                                value={a.name}>{a.name}</option>
                                    )}
                                </select>
                                :
                                <div className='u-warning'>
                                    You have to be part of a team!
                                </div>
                            }
                        </div>
                        <div className='form-group createApplication-applicationId'>
                            <label htmlFor='app_id'>Application ID</label>
                            <small>The ID of the application.</small>
                            <div className='input-group'>
                                <div className='input-addon'>
                                    {this.state.appIdTaken && !edit ?
                                        <Icon
                                            title='App ID is already taken.'
                                            className='is-taken'
                                            fixedWidth
                                            data-block='taken-symbol'
                                            name='close' />
                                        :
                                        <Icon
                                            name='check'
                                            className='is-available'
                                            fixedWidth
                                            data-block='available-symbol'
                                            title='App ID is available.' />}
                                </div>
                                <input
                                    required={true}
                                    id='app_id'
                                    disabled={edit ? 'disabled' : null}
                                    value={edit ? app.id : null}
                                    onKeyUp={this.setCustomValidity.bind(this)}
                                    onChange={this.update.bind(this, 'id', 'value')}
                                    name='yourturn_app_app_id'
                                    data-block='id-input'
                                    title='Starts with character, may end with digit, may have dashes in between.'
                                    pattern='[a-z][a-z0-9\-]*[a-z0-9]'
                                    placeholder='pierone'
                                    type='text' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='name'>Name</label>
                            <small>The full name of your application.</small>
                            <input
                                required={true}
                                id='name'
                                data-block='name-input'
                                value={app.name}
                                onChange={this.update.bind(this, 'name', 'value')}
                                name='yourturn_app_name'
                                placeholder='Pier One'
                                type='text' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='subtitle'>Subtitle</label>
                            <small>A few words on what it is.</small>
                            <input
                                maxLength='140'
                                placeholder='The Docker registry'
                                id='subtitle'
                                value={app.subtitle}
                                onChange={this.update.bind(this, 'subtitle', 'value')}
                                name='yourturn_app_subtitle'
                                type='text' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='service_url'>Service URL</label>
                            <small>Where your application will run.</small>
                            <div className='input-group'>
                                <div className='input-addon'>https://</div>
                                <input
                                    title='Only characters, numbers or dashes with at least one dot in between.'
                                    pattern='([A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])+(\.([A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))*\.[a-zA-Z0-9]+'
                                    placeholder='pierone.stups.examp.le'
                                    id='service_url'
                                    onKeyDown={this.disableAutocomplete.bind(this)}
                                    onChange={this.update.bind(this, 'service_url', 'value')}
                                    value={app.service_url}
                                    name='yourturn_app_service_url'
                                    type='text' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='scm_url'>SCM URL</label>
                            <small>Where you manage your source code.</small>
                            <input
                                placeholder='https://github.com/zalando-stups/pierone.git'
                                id='scm_url'
                                value={app.scm_url}
                                pattern='^https?://.*'
                                title='Please provide an URL with http or https.'
                                onChange={this.update.bind(this, 'scm_url', 'value')}
                                name='yourturn_app_scm_url'
                                type='url' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='documentation_url'>Documentation URL</label>
                            <small>Where your documentation is.</small>
                            <input
                                placeholder='https://github.com/zalando-stups/pierone/docs'
                                id='documentation_url'
                                pattern='^https?://.*'
                                title='Please provide an URL with http or https.'
                                value={app.documentation_url}
                                onChange={this.update.bind(this, 'documentation_url', 'value')}
                                name='yourturn_app_documentation_url'
                                type='url' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='specification_url'>Specification URL</label>
                            <small>Where you manage your tickets.</small>
                            <input
                                placeholder='https://github.com/zalando-stups/pierone/issues'
                                id='specification_url'
                                pattern='^https?://.*'
                                title='Please provide an URL with http or https.'
                                value={app.specification_url}
                                onChange={this.update.bind(this, 'specification_url', 'value')}
                                name='yourturn_app_specification_url'
                                type='url' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='specification_type'>Specification Type</label>
                            <small>What system you use for managing your specifications.</small>
                            <input
                                placeholder='JIRA'
                                id='specification_type'
                                value={app.specification_type}
                                onChange={this.update.bind(this, 'specification_type', 'value')}
                                name='yourturn_app_specification_type'
                                type='text' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='criticality_level'>Criticality Level</label>
                            <small>How critical your application is.</small>
                            <select
                                id='criticality_level'
                                value={app.criticality_level}
                                onChange={this.update.bind(this, 'criticality_level', 'value')}
                                name='yourturn_app_criticality_level'>
                                {[1, 2, 3].map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='description'>Description</label>
                            <small>A more elaborate description than subtitle. You can use <a href='http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html'>Markdown</a>.</small>
                            <Markdown
                                editable={true}
                                src={app.description}
                                onChange={this.update.bind(this, 'description', 'value')} />
                        </div>
                        <div className='btn-group'>
                            <button
                                type='submit'
                                data-block='save-button'
                                disabled={accounts.length === 0}
                                className='btn btn-primary'>
                                <Icon name='save' /> Save
                            </button>
                        </div>
                    </form>
                </div>;
    }
}
ApplicationForm.displayName = 'ApplicationForm';
ApplicationForm.propTypes = {
    applicationId: React.PropTypes.string,
    edit: React.PropTypes.bool,
    kioActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired,
    kioStore: React.PropTypes.object.isRequired
};
ApplicationForm.contextTypes = {
    router: React.PropTypes.object
};

export default ApplicationForm;
