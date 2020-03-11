import * as AppActions from '../../AppActions';

import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    Stack,
    StackItem,
    Split,
    SplitItem,
    Title
} from '@patternfly/react-core';
import React, { Component } from 'react';
import { PieChart } from '../../ChartTemplates/PieChart/PieChartTemplate';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { ClipboardCheckIcon } from '@patternfly/react-icons';
// import { Gauge } from '@red-hat-insights/insights-frontend-components';
import Loading from '../../PresentationalComponents/Loading/Loading';
import PropTypes from 'prop-types';
import { UI_BASE } from '../../AppConstants';
import { connect } from 'react-redux';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class ComplianceCard extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchCompliance();
    }

    render() {
        /*
         * Returns the first two -- if there are at least two entries -- items as a shallow copy of
         * complianceSummary
         */
        const getTopThreePolicies = function (compliance) {
            const complianceTopThree = compliance.data.length > 1 ? compliance.data.slice(0, 3) :
                compliance.data.slice();

            return complianceTopThree;
        };

        const {
            complianceFetchStatus,
            complianceSummary
        } = this.props;

        const pieChartPadding = { bottom: 10, left: 10, right: 220, top: 10 };

        return (
            <Card className='ins-c-card__compliance'
                { ...complianceFetchStatus !== 'pending' ? {
                    'data-ouia-safe': true
                } : { 'data-ouia-safe': false } }
            >
                <CardHeader>
                    <Title size={ 'lg' }>Compliance</Title>
                </CardHeader>
                <CardBody>
                    <Stack>
                        {complianceFetchStatus === 'fulfilled' &&
                            (Array.isArray(complianceSummary.data) &&
                                (complianceSummary.data.length > 0 ? (
                                    getTopThreePolicies(complianceSummary).map(element =>
                                        <StackItem gutter='sm' key={ element.id }>
                                            <div className="ins-c-compliance__row">
                                                <div className="ins-c-compliance__row-item">
                                                    <PieChart
                                                        containerWidth={ 290 }
                                                        containerHeight={ 90 }
                                                        ariaDesc="Operating systems used"
                                                        ariaTitle="Pie chart operating systems"
                                                        constrainToVisibleArea={ true }
                                                        data={ [
                                                            { x: element.attributes.name, y: element.attributes.score * 100 },
                                                            { x: 'empty', y: 100 }
                                                        ] }
                                                        height={ 600 }
                                                        labels={ ({ datum }) => `${datum.x}: ${datum.y}` }
                                                        legendOrientation="vertical"
                                                        legendPosition="right"
                                                        padding={ pieChartPadding }
                                                        width={ 600 }
                                                        colorScale={ ['#002f5d', '#06c', '#8bc1f7'] }
                                                    />
                                                </div>
                                                <div className="ins-c-compliance__row-item">
                                                    <Stack>
                                                        <StackItem>
                                                            <Button
                                                                className="ins-c-compliance__policy-link"
                                                                component="a"
                                                                href={ `/${UI_BASE}/compliance/policies/` }
                                                                variant="link"
                                                                isInline
                                                            >
                                                                {element.attributes.name}
                                                            </Button>
                                                        </StackItem>
                                                        <StackItem>
                                                            <Split gutter='sm'>
                                                                <SplitItem>
                                                                    {element.attributes.compliant_host_count} systems
                                                                </SplitItem>
                                                                <SplitItem>
                                                                    {Math.trunc(element.attributes.score * 100)}% passes
                                                                </SplitItem>
                                                            </Split>
                                                        </StackItem>
                                                    </Stack>
                                                </div>
                                            </div>
                                        </StackItem>
                                    )
                                ) : (
                                    <EmptyState>
                                        <EmptyStateIcon icon={ ClipboardCheckIcon } />
                                        <EmptyStateBody> You have not uploaded any reports yet </EmptyStateBody>
                                    </EmptyState>
                                ))
                            )
                        }
                        {complianceFetchStatus === 'pending' && (<Loading />)}
                    </Stack>
                </CardBody>
                <CardFooter>
                    <StackItem>
                        <div className="ins-c-compliance__row">
                            <div className="ins-c-compliance__row-item">
                            </div>
                            <div className="ins-c-compliance__row-item">
                                <Button
                                    className="ins-c-compliance__policy-link"
                                    component="a"
                                    href={ `/${UI_BASE}/compliance/policies/` }
                                    variant="link"
                                    isInline
                                >
                                    View all{complianceFetchStatus === 'fulfilled' && Array.isArray(complianceSummary.data) &&
                                    complianceSummary.data.length > 1 ? ` ${complianceSummary.data.length} ` : ' '}
                                    compliance policies
                                </Button>
                            </div>
                        </div>
                    </StackItem>
                    {/* <a href={ `${UI_BASE}/compliance/policies/` }>
                        View all{complianceFetchStatus === 'fulfilled' && Array.isArray(complianceSummary.data) &&
                            complianceSummary.data.length > 1 ? ` ${complianceSummary.data.length} ` : ' '}
                        compliance policies
                    </a> */}
                </CardFooter>
            </Card>
        );
    }
}

ComplianceCard.propTypes = {
    fetchCompliance: PropTypes.func,
    complianceSummary: PropTypes.object,
    complianceFetchStatus: PropTypes.string
};

const mapStateToProps = (state, ownProps) => ({
    complianceSummary: state.DashboardStore.complianceSummary,
    complianceFetchStatus: state.DashboardStore.complianceFetchStatus,
    ...ownProps
});

const mapDispatchToProps = dispatch => ({
    fetchCompliance: (url) => dispatch(AppActions.fetchComplianceSummary(url))
});

export default routerParams(connect(
    mapStateToProps,
    mapDispatchToProps
)(ComplianceCard));
