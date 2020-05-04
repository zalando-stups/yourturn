import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'react-fa';
import Markdown from 'common/src/markdown.jsx';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import SERVICE_URL_TLD from 'SERVICE_URL_TLD';
import 'common/asset/less/application/application-form.less';

class ApplicationForm extends React.Component {
    /*eslint-disable react/no-direct-mutation-state */
    // TODO fix direct mutation of state here if possible
    constructor(props) {
        super();
        this.state = {
            autocompleteServiceUrl: true
        };
        if (props.edit) {
            let {application} = props;
            application.service_url = application.service_url && application.service_url.indexOf('https://') === 0 ?
                                application.service_url.substring('https://'.length) :
                                application.service_url;
            this.state.app = application;
        } else {
            const {userTeams} = props;
            this.state.app = {
                active: true,
                criticality_level: undefined,
                publicly_accessible: false,
                team_id: userTeams.length ? userTeams[0] : undefined
            };
        }
    }
    /*eslint-enable react/no-direct-mutation-state */

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

    /*eslint-disable react/no-direct-mutation-state */
    // TODO fix direct mutation of state here if possible
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
            appIdTaken: this.props.applicationIds.some(id => this.state.app.id === id)
        });
    }
    /*eslint-enable react/no-direct-mutation-state */

    render() {
        let {edit, applicationId, application, userTeams} = this.props,
            {app} = this.state;
        const LINK_PARAMS = {applicationId};
        return <div className='applicationForm'>
                    {edit ?
                        <div>
                            <h2>Edit <Link
                                        to={Routes.appDetail(LINK_PARAMS)}>{application.name || applicationId}</Link>
                            </h2>
                            <div className='btn-group'>
                                <Link
                                    to={Routes.appDetail(LINK_PARAMS)}
                                    className='btn btn-default'>
                                    <Icon name='chevron-left' /> {application.name || applicationId}
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
                            {userTeams.length ?
                                <select
                                    data-block='team-input'
                                    name='yourturn_app_team_id'
                                    defaultValue={app.team_id || userTeams[0]}
                                    onChange={this.update.bind(this, 'team_id', 'value')}
                                    id='team_id'>
                                    {userTeams.map(
                                        id => <option
                                                key={id}
                                                value={id}>{id}</option>
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
                            <small>The full name of your application.
                            The application MUST have a human-readable name. The name SHOULD be meaningful and reflect the purpose of the application.</small>
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
                            <small>A few words on what it is.
                            The application SHOULD have a meaningful and short subtitle. The subtitle can be a tagline. Example: subtitle 'Checks customer addresses' for an app 'Address Service'.</small>
                            <input
                                maxLength='140'
                                placeholder='Checks foo bar items'
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
                            <small>Where you manage your source code.
                            The application SHOULD have a link to the main source code repository (git repo).</small>
                            <input
                                placeholder='https://github.com/zalando-stups/pierone'
                                id='scm_url'
                                value={app.scm_url}
                                pattern='^https://[^/]+/[^/]+/[^/]+$'
                                title='Please provide an URL with HTTPS in the form https://<host>/<org>/<repo>.'
                                onChange={this.update.bind(this, 'scm_url', 'value')}
                                name='yourturn_app_scm_url'
                                type='url' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='support_url'>Support</label>
                            <small>Where you can file for support issues or feature requests. Must be an HTTPS URL or an email address</small>
                            <input
                                placeholder='https://github.com/zalando-stups/pierone/issues'
                                id='support_url'
                                value={app.support_url}
                                pattern='((^https:\/\/.*$)|(^[\S]+@[\S]+$))'
                                title='Please provide a URL with HTTPS or an email address'
                                onChange={this.update.bind(this, 'support_url', 'value')}
                                name='yourturn_app_support_url'
                                type='text' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='documentation_url'>Documentation URL</label>
                            <small>Where your documentation is.
                            The application SHOULD have a link to its documentation.</small>
                            <input
                                placeholder='https://github.com/zalando-stups/pierone/docs'
                                id='documentation_url'
                                pattern='^https://.*'
                                title='Please provide an URL with HTTPS.'
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
                                pattern='^https://.*'
                                title='Please provide an URL with HTTPS.'
                                value={app.specification_url}
                                onChange={this.update.bind(this, 'specification_url', 'value')}
                                name='yourturn_app_specification_url'
                                type='url' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='criticality_level'>Criticality Level / Application Tier</label>
                            <small>How critical your application is.</small>
                            <select
                                id='criticality_level'
                                value={app.criticality_level}
                                onChange={this.update.bind(this, 'criticality_level', 'value')}
                                name='yourturn_app_criticality_level'>
                                    <option key='' value=''>Not Classified</option>
                                    <option key='1' value='1'>Tier-1</option>
                                    <option key='2' value='2'>Tier-2</option>
                                    <option key='3' value='3'>Tier-3</option>
                                    <option key='4' value='4'>Not Relevant</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='incident_contact'>24x7 Incident Contact</label>
                            <small>Name of the responsible 24x7 on-call team</small>
                            <input
                                maxLength='140'
                                placeholder='My On-Call Team'
                                id='incident_contact'
                                value={app.incident_contact}
                                onChange={this.update.bind(this, 'incident_contact', 'value')}
                                name='yourturn_app_incident_contact'
                                type='text' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='description'>Description</label>
                            <small>A more elaborate description than subtitle. You can use <a href='http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html'>Markdown</a>.
                            The application MUST have a textual description. The description MUST contain the purpose of the application (why the application exists, what its business value is).</small>
                            <Markdown
                                editable={true}
                                src={app.description}
                                onChange={this.update.bind(this, 'description', 'value')} />
                        </div>
                        <div className='btn-group'>
                            <button
                                type='submit'
                                data-block='save-button'
                                disabled={userTeams.length === 0}
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
    application: React.PropTypes.object,
    applicationId: React.PropTypes.string,
    applicationIds: React.PropTypes.array.isRequired,
    edit: React.PropTypes.bool.isRequired,
    kioActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired,
    userTeams: React.PropTypes.array.isRequired
};

ApplicationForm.contextTypes = {
    router: React.PropTypes.object
};

export default ApplicationForm;
