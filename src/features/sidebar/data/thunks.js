import { getSequenceMetadata, updateModels, updateModel } from '@edx/frontend-app-learning';

export default function fetchUnits(sequenceIds) {
  return async (dispatch) => {
    const sequenceMetadataPromises = sequenceIds.map(sequenceId => getSequenceMetadata(sequenceId));
    const sequenceMetadatas = await Promise.allSettled(sequenceMetadataPromises);
    sequenceMetadatas.forEach(({ value }) => {
      // value may be undefined, specially during tests
      const sequence = value?.sequence;
      const units = value?.units;
      if (sequence?.blockType !== 'sequential') {
        // Some other block types (particularly 'chapter') can be returned
        // by this API. We want to error in that case, since downstream
        // courseware code is written to render Sequences of Units.
      } else {
        dispatch(updateModel({
          modelType: 'sequences',
          model: sequence,
        }));
        dispatch(updateModels({
          modelType: 'units',
          models: units,
        }));
      }
    });
  };
}
