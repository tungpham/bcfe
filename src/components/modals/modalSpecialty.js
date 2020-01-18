import React, {useState, useEffect} from 'react';
import { Grid, Typography,  Box, Chip } from '@material-ui/core';
import SearchSpecialties from './specialtySearchBox';
import SpecApis from 'services/spec';
import '../../assets/css/conflictRemove.css';

function ModalSepcialty(props) {
    const [searchArray, setSearchArray] = useState([]);
    const [searchArrayConfig, setSearchArrayConfig] = useState([]);
    async function  getSpecialties(){
        await SpecApis.getAllSpecialties().then((data) => {
            setSearchArrayConfig(data.data.content.map(item=>({id:item.id, name:item.name})))
            setSearchArray(data.data.content.map(item=>({id:item.id, name:item.name})))
        })
    }
    function deleteSelect(specialty)
    {
        var _temp = [...props.specialities];
        _temp = _temp.filter(item=>{return item.id !== specialty.id})
        props.setSpecialties(_temp);
    }
    function checkIncludes(array, _item)
    {
        var result = false;
        array.forEach(item=>{
            if(item.name === _item.name) result = true;
        })
        return result;
        
    }
    useEffect(()=>{
        getSpecialties();
    },[])
    useEffect(()=>{
        if(searchArrayConfig.length > 0)
        {
            var _searchArray = searchArrayConfig.filter(_item => !checkIncludes(props.specialities, _item));
            setSearchArray(_searchArray);
        }
        
    },[props.specialities, searchArrayConfig])
    return (
        <React.Fragment>
            <Grid className="service-modal-col city-head-text font-weight" item xs={10}>
                <Typography className="heading-service" variant="h5">
                Select service/specialty
               </Typography>
               <p className='red font'>{props.errorMessage}</p>
               <Box>
                    {
                        searchArray.length > 0 ? (
                            <SearchSpecialties options = {searchArray} setSpecialties = {props.setSpecialties} specialities = {props.specialities}/>
                        ) : (null)
                    }
               </Box>
               <Box style = {{maxHeight:"300px", overflowY:"auto"}}>
                   {
                       props.specialities.length > 0 ? props.specialities.map((specialty, index) => (
                            <Chip
                                key={`specialty-item-${index}`}
                                label={specialty.name}
                                onDelete={() => deleteSelect(specialty)}
                                style = {{display:"inlineBlock", margin:"3px 5px"}}
                            />
                       )):(null)
                   }
               </Box>
            </Grid>
        </React.Fragment>
    );
}
export default ModalSepcialty;