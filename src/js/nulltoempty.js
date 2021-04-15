export default function nulltoempty( obj ){
    let new_obj = { }
    for( const [ key, value ] of Object.entries( obj ) ){
        new_obj[ key ] = ( value ? value : "" );
    }   

    return new_obj;
}