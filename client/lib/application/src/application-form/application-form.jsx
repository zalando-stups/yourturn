import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import SERVICE_URL_TLD from 'SERVICE_URL_TLD';
import {constructLocalUrl} from 'common/src/data/services';
import 'common/asset/less/application/application-form.less';

class ApplicationForm extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            user: props.globalFlux.getStore('user'),
            kio: props.flux.getStore('kio')
        };
        let {kio, user} = this.stores;
        this.state = {
            autocompleteServiceUrl: true
        };
        if (props.edit) {
            let app = kio.getApplication(props.applicationId);
            app.service_url = app.service_url.substring('https://'.length);
            this.state.app = app;
        } else {
            this.state.app = {
                active: true,
                team_id: user.getUserTeams()[0].id
            };
        }

        this._forceUpdate = this.forceUpdate.bind(this);
        this.stores.user.on('change', this._forceUpdate);
    }

    componentWillUnmount() {
        this.stores.user.off('change', this._forceUpdate);
    }

    disableAutocomplete() {
        this.setState({
            autocompleteServiceUrl: false
        });
    }

    setCustomValidity(evt) {
        React.findDOMNode(evt.target).setCustomValidity(
            this.state.appIdTaken ?
                'Application ID is already taken' :
                '');
    }

    /**
     * Saves the application to kio.
     */
    save(evt) {
        evt.preventDefault();

        let {app} = this.state;

        app.service_url = app.service_url ? 'https://' + app.service_url : '';

        this
        .props
        .flux
        .getActions('kio')
        .saveApplication(this.state.app.id, this.state.app)
        .then(() => {
            this.context.router.transitionTo(constructLocalUrl('application', [this.state.app.id]));
        })
        .catch(() => {
            let verb = this.props.edit ? 'update' : 'create';
            this
            .props
            .globalFlux
            .getActions('notification')
            .addNotification(
                `Could not ${verb} application ${app.name}.`,
                'error'
            );
        });
    }

    update(field, prop, evt) {
        this.state.app[field] = evt.target[prop];
        if (this.state.autocompleteServiceUrl) {
            this.state.app.service_url = `${this.state.app.id}.${this.state.app.team_id}.${SERVICE_URL_TLD}`;
        }
        this.setState({
            app: this.state.app,
            appIdTaken: this.stores.kio.getApplication(this.state.app.id) !== false
        });
    }

    render() {
        let {edit, applicationId} = this.props,
            storeApp = this.stores.kio.getApplication(applicationId),
            {app} = this.state,
            teams = this.stores.user.getUserTeams();
        return <div className='applicationForm'>
                    {edit ?
                        <div>
                            <h2>Edit <Link
                                        to='application-appDetail'
                                        params={{
                                            applicationId: applicationId
                                        }}>{storeApp.name}</Link>
                            </h2>
                            <div className='btn-group'>
                                <Link
                                    to='application-appDetail'
                                    className='btn btn-default'
                                    params={{
                                        applicationId: applicationId
                                    }}>
                                    <Icon name='chevron-left' /> {storeApp.name}
                                </Link>
                            </div>
                        </div>
                        :
                        <div>
                            <h2>Create a new <Link to='application-appList'>Application</Link></h2>
                            <div className='btn-group'>
                                <Link
                                    to='application-appList'
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
                        </div>
                        <div className='form-group'>
                            <label htmlFor='team_id'>Team ID</label>
                            <small>The ID of the owning team.</small>
                            {edit ?
                                <input
                                    id='team_id'
                                    value={app.team_id}
                                    disabled='disabled'
                                    type='text' />
                                :
                                <select
                                    name='yourturn_app_team_id'
                                    defaultValue={teams[0].id}
                                    onChange={this.update.bind(this, 'team_id', 'value')}
                                    id='team_id'>
                                    {teams.map(
                                        t => <option
                                                key={t.id}
                                                value={t.id}>{t.name}</option>
                                    )}
                                </select>
                            }
                        </div>
                        <div className='form-group createApplication-applicationId'>
                            <label htmlFor='app_id'>Application ID</label>
                            <small>The ID of the application.</small>
                            <div className={'input-group'}>
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
                                    pattern='[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9]'
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
                                    pattern='([A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])+(\.([A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9]))*\.\w+'
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
                                value={app.specification_url}
                                onChange={this.update.bind(this, 'specification_url', 'value')}
                                name='yourturn_app_specification_url'
                                type='url' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='description'>Description</label>
                            <small>A more elaborate description than subtitle. You can use <a href='http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html'>Markdown</a>.</small>
                            <textarea
                                id='description'
                                name='yourturn_app_description'
                                onChange={this.update.bind(this, 'description', 'value')}
                                cols='30'
                                defaultValue={app.description}
                                rows='10' />
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
ApplicationForm.displayName = 'ApplicationForm';
ApplicationForm.propTypes = {
    applicationId: React.PropTypes.string,
    flux: React.PropTypes.object.isRequired,
    edit: React.PropTypes.bool,
    globalFlux: React.PropTypes.object.isRequired
};
ApplicationForm.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ApplicationForm;