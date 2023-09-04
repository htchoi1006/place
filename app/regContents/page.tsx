import { Category, KnowHowType, Tag } from '@prisma/client'
import { getCategories } from '../services/categoryService'
import { getKnowHowTypes } from '../services/knowHowService';
import Registeration from './components/registeration';
import { getTags, getTagsStartsWith } from '../services/tagService';
import RregiServerPage from './components/regiServer';
import FileUploader from '@/components/controls/fileUploader';
import Uploader from './components/uploader';

const RegContentPage = async ({ searchParams }: { searchParams: { searchBy: string, } }) => {

  // console.log('search params:', searchParams.searchBy)

  const categories = await getCategories() as Array<Category>
  const knowHowTypes = await getKnowHowTypes() as Array<KnowHowType>;
  
  const tags = await getTagsStartsWith(searchParams.searchBy) as Array<Tag>;
  // console.log('tags: ', JSON.stringify(tags,null,2))

  return (<>
    <Registeration categories={categories} knowHowTypes={knowHowTypes} tags={tags} />

    <Uploader />

  </>

  )
}

export default RegContentPage