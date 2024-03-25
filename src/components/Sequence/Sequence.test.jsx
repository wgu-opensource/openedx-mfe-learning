import { Factory } from 'rosie';
import {
  render, waitFor, initializeTestStore,
} from '../../setupTest';
import Sequence from './Sequence';

describe('Sequence', () => {
  let mockData;
  const courseMetadata = Factory.build('courseMetadata');
  const unitBlocks = Array.from({ length: 3 }).map(() => Factory.build(
    'block',
    { type: 'vertical' },
    { courseId: courseMetadata.id },
  ));

  beforeAll(async () => {
    const store = await initializeTestStore({ courseMetadata, unitBlocks });
    const { courseware } = store.getState();
    mockData = {
      unitId: unitBlocks[0].id,
      units: [],
      title: 'Test',
      status: 'Pending',
      id: courseware.sequenceId,
      courseId: courseware.courseId,
      sectionId: courseMetadata.sectionId,
      hasCurrentUnit: false,
      isActiveSequence: false,
      currentUnitId: unitBlocks[0].id,
      collapsibleMenuState: {},
      onOpenCollapse: () => {},
    };
  });

  it('notifies students of locked content', async () => {
    const sequenceBlocks = [Factory.build(
      'block',
      { type: 'sequential', children: unitBlocks.map(block => block.id) },
      { courseId: courseMetadata.id },
    )];

    const gatedContent = {
      gated: true,
      prereq_id: `${sequenceBlocks[0].id}-prereq`,
      prereq_section_name: `${sequenceBlocks[0].display_name}-prereq`,
      gated_section_name: sequenceBlocks[0].display_name,
    };

    const sequenceMetadata = [Factory.build(
      'sequenceMetadata',
      { gated_content: gatedContent },
      { courseId: courseMetadata.id, unitBlocks, sequenceBlock: sequenceBlocks[0] },
    )];

    const testStore = await initializeTestStore({
      courseMetadata, unitBlocks, sequenceBlocks, sequenceMetadata,
    }, false);

    const { container } = render(
      <Sequence {...mockData} {...{ id: sequenceBlocks[0].id }} />,
      { store: testStore },
    );
    await waitFor(() => expect(container.querySelector('svg')).toHaveClass('fa-lock'));
  });
});
