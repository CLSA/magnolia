<?php
/**
 * requisition.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * requisition: record
 */
class requisition extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    // track if this is a new requisition
    $is_new = is_null( $this->id );

    // generate a random identifier if none exists
    if( is_null( $this->identifier ) ) $this->identifier = 'T'.rand( 10000, 99999 );

    // select the next deadline
    if( is_null( $this->deadline_id ) )
    {
      $deadline_class_name = lib::get_class_name( 'database\deadline' );
      $db_deadline = $deadline_class_name::get_next();
      if( is_null( $db_deadline ) )
        throw lib::create( 'exception\runtime',
          'Cannot create new requisition since there are no deadlines defined.',
          __METHOD__ );

      $this->deadline_id = $db_deadline->id;
    }

    parent::save();

    // if we're changing the ethics_filename to null then delete the ethics_letter file
    if( is_null( $this->ethics_filename ) )
    {
      $filename = sprintf( '%s/%s', ETHICS_LETTER_PATH, $this->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }

    // if this is a new requisition then assign it to the first stage
    if( $is_new ) $this->add_to_stage( 1 );
  }

  /**
   * Returns the requisitions last stage
   * @return database\stage
   * @access public
   */
  public function get_last_stage()
  {
    // check the primary key value
    if( is_null( $this->id ) ) 
    {   
      log::warning( 'Tried to query requisition with no primary key.' );
      return NULL;
    }   
    
    $select = lib::create( 'database\select' );
    $select->from( 'requisition_last_stage' );
    $select->add_column( 'stage_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'requisition_id', '=', $this->id );

    $stage_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_id ? lib::create( 'database\stage', $stage_id ) : NULL;
  }

  /**
   * Adds the requisition to a stage
   * 
   * The stage type may either be a stage_type object, the name of a stage_type, the rank of a
   * stage_type or NULL.  NULL should only be used when the current stage_type only has one "next"
   * stage_type, otherwise an exception will be thrown.
   * @param mixed $stage_type A rank, name or stage_type record
   * @param boolean $unprepared Whether the stage must be prepared (set to NULL for the stage_type's default)
   * @access public
   */
  public function add_to_stage( $stage_type = NULL, $unprepared = NULL )
  {
    // check the primary key value
    if( is_null( $this->id ) ) 
    {   
      log::warning( 'Tried to add stage to requisition with no primary key.' );
      return;
    }   

    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $db_user = lib::create( 'business\session' )->get_user();

    $db_stage_type = NULL;
    if( is_null( $stage_type ) )
    {
      // get the next stage_type
      $db_last_stage = $this->get_last_stage();
      if( !is_null( $db_last_stage ) )
      {
        $next_stage_type_list = $db_last_stage->get_stage_type()->get_next_stage_type_list();
        if( 1 == count( $next_stage_type_list ) ) $db_stage_type = current( $next_stage_type_list );
      }
    }
    else if( util::string_matches_int( $stage_type ) )
    {
      $db_stage_type = $stage_type_class_name::get_unique_record( 'rank', $stage_type );
    }
    else if( is_string( $stage_type ) )
    {
      $db_stage_type = $stage_type_class_name::get_unique_record( 'name', $stage_type );
    }
    else if( is_a( $db_stage_type, lib::get_class_name( 'database\stage_type' ) ) )
    {
      $db_stage_type = $stage_type;
    }

    if( is_null( $db_stage_type ) )
      throw lib::create( 'exception\argument', 'stage_type', $stage_type, __METHOD__ );

    $db_stage = lib::create( 'database\stage' );
    $db_stage->requisition_id = $this->id;
    $db_stage->stage_type_id = $db_stage_type->id;
    $db_stage->datetime = util::get_datetime_object();
    $db_stage->user_id = $db_user->id;
    $db_stage->unprepared = is_null( $unprepared ) ? $db_stage_type->preperation_required : $unprepared;
    $db_stage->save();
  }
}
