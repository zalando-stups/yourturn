import React from 'react';

const Charts = (props) => {

    const arrayOfChartComponets = props.versions.map((version, index) => {
        const versionDataSet = props.versionDataSets.find(e => e.version_id == version.id);

        const titleWithButton = <TitleWithButton
            title   = {version.id}
            onClick = {() => this.onDeselect(version.id)}
        />;

        const chart = <Chart
            height    = {CHART_HEIGHT}
            width     = {props.width}
            startDate = {props.brushExtentStartDate}
            endDate   = {props.brushExtentEndDate}
            dataSet   = {versionDataSet}
        />;

        const links = <Link
            to={Routes.verApproval({applicationId, versionId: version.id})}
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
        {arrayOfChartComponets}
    )

};

Charts.displayName = 'Charts';

Charts.propTypes = {
    applicationId
    onDeselect
    versions
    versionDataSets
    width
};

export default Charts;