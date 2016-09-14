import React from 'react';

import { Link } from 'react-router';
import * as Routes from 'application/src/routes';
import Chart from 'common/src/components/pure/Chart.jsx';
import Icon from 'react-fa';
import ThreeColumns from 'common/src/components/pure/ThreeColumns.jsx';
import * as utils from './charts_utils.jsx';


const CHART_HEIGHT = 200;

const Charts = (props) => {
    const arrayOfChartComponets = props.versions.map((version, index) => {
        const versionDataSet = props.versionDataSets.find(e => e.version_id == version.id);

        const leftElements =
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <div>
                    <Link
                        to={Routes.verApproval({applicationId: props.applicationId, versionId: version.id})}
                        className='btn btn-default btn-small'>
                        <Icon fixedWidth name='check' />
                    </Link>
                    Approvals
                </div>
                <div>
                    <utils.ScmShortCut {...props} />
                </div>
                <div>
                    <utils.ServiceShortCut {...props} />
                </div>
            </div>;

        const rightElements = <div
            className = 'btn btn-danger btn-small'
            onClick = {() => props.onDeselect(version.id)}>
            <Icon size='2x' name='remove' />
        </div>;


        const chart = <Chart
            height    = {CHART_HEIGHT}
            width     = {props.width}
            startDate = {props.extentStartDate}
            endDate   = {props.extentEndDate}
            dataSet   = {versionDataSet}
        />;

        return (
            <div key = {index}>
                <ThreeColumns
                              middleChildren = {<h3>{version.id}</h3>}
                />
                <ThreeColumns
                              leftChildren   = {leftElements}
                              middleChildren = {chart}
                              rightChildren  = {rightElements}
                />
            </div>
        );
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
    extentEndDate: React.PropTypes.instanceOf(Date).isRequired,
    extentStartDate: React.PropTypes.instanceOf(Date).isRequired,
    onDeselect: React.PropTypes.func.isRequired,
    versionDataSets: React.PropTypes.array.isRequired,
    versions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    width: React.PropTypes.number.isRequired
};

export default Charts;