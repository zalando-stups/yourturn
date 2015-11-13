/* global ENV_TEST */
import React from 'react';
import Icon from 'react-fa';
import Remarkable from 'remarkable';
import {Tabs, TabList, TabPanel, Tab} from 'react-tabs';
import 'common/asset/less/common/markdown.less';

const MD = new Remarkable({
    linkify: true,
    typographer: false,
    quotes: '“”‘’'
});

class Markdown extends React.Component {
    constructor(props) {
        super();
        this.state = {
            content: props.src,
            activeTab: 0,
            html: MD.render(props.src)
        };
    }

    _renderMd(tab) {
        this.setState({
            activeTab: tab
        });
        if (tab === 1) {
            this.setState({
                html: MD.render(this.state.content)
            });
        }
    }

    _updateContent(evt) {
        this.setState({
            content: evt.target.value
        });
        if (this.props.editable && this.props.onChange) {
            this.props.onChange(evt);
        }
    }

    render() {
        let preview = <div
                        className={'markdown ' + (this.props.className || '')}
                        data-block={this.props.block || null}
                        dangerouslySetInnerHTML={{
                            __html: this.state.html
                        }} />;
        // this sucks hard, but - i think - because react-tabs
        // is cloning elements outside of its render function
        // React complains that only ReactOwners may have refs.
        // this happens only in tests though, so we do not render
        // tabs in tests for now.
        // https://github.com/rackt/react-tabs/issues/52
        if (!this.props.editable || ENV_TEST) {
            return preview;
        }
        return <div className={'markdown-editor ' + (this.props.editable ? 'is-editable' : '')}>
            <Tabs
                selectedIndex={this.state.activeTab}
                onSelect={this._renderMd.bind(this)}>
                <TabList>
                    <Tab><Icon fixedWidth name='pencil' /> Edit</Tab>
                    <Tab><Icon fixedWidth name='eye' /> Preview</Tab>
                </TabList>
                <TabPanel>
                    <textarea
                        placeholder={this.props.placeholder}
                        onChange={this._updateContent.bind(this)}
                        value={this.state.content}
                        cols='30'
                        rows='10'/>
                </TabPanel>
                <TabPanel>
                    {preview}
                </TabPanel>
            </Tabs>
        </div>;
    }
}
Markdown.displayName = 'Markdown';
Markdown.propTypes = {
    src: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    block: React.PropTypes.string,
    editable: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func
};

export default Markdown;