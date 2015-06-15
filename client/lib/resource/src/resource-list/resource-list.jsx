import React from 'react';
import 'common/asset/less/resource/resource-list.less';

class ResourceList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            essentials: props.flux.getStore('essentials'),
            user: props.globalFlux.getStore('user')
        };
        this.state = {
            term: ''
        };
        this._forceUpdate = this.forceUpdate.bind(this);
        this.stores.user.on('change', this._forceUpdate);
    }

    componentWillUnmount() {
        this.stores.user.off('change', this._forceUpdate);
    }

    filter(evt) {
        this.setState({
            term: evt.target.value
        });
    }

    render() {
        let {essentials, user} = this.stores,
            {term} = this.state,
            whitelisted = user.isWhitelisted(),
            resources = essentials.getResources(term);
        return <div className='resourceList'>
                    <h2>Resource Types</h2>
                    <div className='u-info'>
                        <div>
                            An example of a resource is <em>one</em> sales order of a customer. The resource type of it would be <em>“sales order”</em>. Another example for resource types is <em>“customer information”</em> where the resource would be the master data of <em>one</em> customer.
                        </div>
                    </div>
                    <div className='btn-group'>
                        <a href='/resource/create'
                            className={`btn btn-primary ${whitelisted ? '' : 'btn-disabled'}`}>
                            <i className='fa fa-plus'></i> Create Resource Type
                        </a>
                    </div>
                    <div className='form-group'>
                        <form className='form'>
                            <label htmlFor='yourturn-search'>Search:</label>
                            <div className='input-group'>
                                <div className='input-addon'>
                                    <i className='fa fa-search'></i>
                                </div>
                                <input
                                    name='yourturn_search'
                                    autoFocus='autofocus'
                                    value={term}
                                    onChange={this.filter.bind(this)}
                                    type='search'
                                    aria-label='Enter your term'
                                    data-action='search'
                                    placeholder='Sales Order' />
                            </div>
                        </form>
                    </div>
                    {resources.length ?
                        <ul data-block='resources'>
                            {resources.map(
                                res =>
                                    <li key={res.id}>
                                        <a href={`/resource/detail/${res.id}`}>{res.name}</a>
                                    </li>)}
                        </ul>
                        :
                        <span>No Resource Types.</span>}
                </div>;
    }
}

export default ResourceList;