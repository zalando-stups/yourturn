// lolz
/* lol */
import React from 'react';
import 'common/asset/less/application/application-form.less';

class Class extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            user: props.flux.getStore('user'),
            app: this.props.flux.getStore('app')
        };
        this.action = props.flux.getActions('user');
        
        props.flux.getActions('whatever').call(13);
      
        this.props.flux.getActions('blob').fetch().then();
    }

    render() {
        let user = this.stores.user.getUser('current');
        moreUsers = this.props.getStore('user').do(23);
        this.action.do();
    }

}

export default Class;
