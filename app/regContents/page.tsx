import { Category, KnowhowType, Tag } from '@prisma/client'
import { getCategories } from '../services/categoryService'
import { getKnowHowTypes } from '../services/knowhowService';
import Registeration from './components/registeration';
import { getTags, getTagsStartsWith } from '../services/tagService';
// import RregiServerPage from './components/regiServer';
import FileUploader from '@/components/controls/fileUploader';

const RegContentPage = async ({ searchParams }: { searchParams: { searchBy: string, } }) => {
  const categories = await getCategories() as Array<Category>
  const knowHowTypes = await getKnowHowTypes() as Array<KnowhowType>;
  const tags = await getTagsStartsWith(searchParams.searchBy) as Array<Tag>;

  return (<>
    <Registeration categories={categories} knowHowTypes={knowHowTypes} tags={tags} />
  </>

  )
}

export default RegContentPage