import React from 'react';

import { Link } from 'react-router';
import * as Routes from 'application/src/routes';
import Chart from 'common/components/pure/Chart.jsx';
import Icon from 'react-fa';
import TitleWithButton from 'common/components/pure/TitleWithButton.jsx';
import ThreeColumns from 'common/components/pure/ThreeColumns.jsx';

const CHART_HEIGHT = 200;

const Charts = (props) => {

    console.log("charts %O", props);

    const arrayOfChartComponets = props.versions.map((version, index) => {
        const versionDataSet = props.versionDataSets.find(e => e.version_id == version.id);

        const titleWithButton = <TitleWithButton
            title   = {version.id}
            onClick = {() => this.onDeselect(version.id)}
        />;

        const chart = <Chart
            height    = {CHART_HEIGHT}
            width     = {props.width}
            startDate = {props.extentStartDate}
            endDate   = {props.extentEndDate}
            dataSet   = {versionDataSet}
        />;

        const links = <Link
            to={Routes.verApproval({applicationId: props.applicationId, versionId: version.id})}
            className='btn btn-default btn-small'>
            <Icon name='check'/>
        </Link>;

        return (
            <ThreeColumns key = {index}
                          leftChildren   = {titleWithButton}
                          middleChildren = {chart}
                          rightChildren  = {links}
            />);
    });

    return (
        <div>
            {arrayOfChartComponets}
        </div>
    )

};

Charts.displayName = 'Charts';

Charts.propTypes = {
    applicationId: React.PropTypes.string,
    onDeselect: React.PropTypes.func.isRequired,
    versions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    versionDataSets: React.PropTypes.array.isRequired,
    extentStartDate: React.PropTypes.instanceOf(Date).isRequired,
    extentEndDate: React.PropTypes.instanceOf(Date).isRequired,
    width: React.PropTypes.number.isRequired
};

export default Charts;