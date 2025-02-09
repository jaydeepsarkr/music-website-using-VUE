import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('SongItem.vue', () => {
    test('renders correctly', () => {
        const song = {
            docID: 'test',
            display_name: 'test',
            modified_name: 'test',
            comment_count: 5,
        };
        const wrapper = shallowMount(SongItem, {
            propsData: { song },
            global: {
                components: {
                    'router-link': RouterLinkStub,
                },
            },
        });
        expect(wrapper.element).toMatchSnapshot();
    });
});
