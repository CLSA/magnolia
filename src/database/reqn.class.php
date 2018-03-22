<?php
/**
 * reqn.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn: record
 */
class reqn extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    // track if this is a new reqn
    $is_new = is_null( $this->id );

    // generate a random identifier if none exists
    if( is_null( $this->identifier ) ) $this->identifier = 'T'.rand( 10000, 99999 );

    // make sure the deadline is appropriate
    $this->assert_deadline();

    parent::save();

    // if we're changing the ethics_filename to null then delete the ethics_letter file
    if( is_null( $this->ethics_filename ) )
    {
      $filename = sprintf( '%s/%s', ETHICS_LETTER_PATH, $this->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }

    // if this is a new reqn then assign it to the first stage
    if( $is_new ) $this->add_to_stage( 1 );
  }

  /**
   * Check the reqn's deadline and change it to the next available deadline if needed
   * NOTE: This method will change the deadline_id column but not save the record
   * @access public
   */
  public function assert_deadline()
  {
    $deadline_class_name = lib::get_class_name( 'database\deadline' );

    $db_deadline = NULL;
    $change_deadline = false;
    if( is_null( $this->deadline_id ) )
    { // no deadline found
      $db_deadline = $deadline_class_name::get_next();
      $change_deadline = true;
    }
    else
    {
      $rank = $this->get_current_rank();
      if( is_null( $rank ) || 1 == $rank )
      {
        if( 0 < $this->get_deadline()->date->diff( util::get_datetime_object() )->days )
        { // deadline has expired, get the next one
          $db_deadline = $deadline_class_name::get_next();
          $change_deadline = true;
        }
      }
    }
    
    if( $change_deadline )
    {
      if( is_null( $db_deadline ) )
        throw lib::create( 'exception\runtime',
          'Cannot proceed since there are no future deadlines defined.',
          __METHOD__ );
      $this->deadline_id = $db_deadline->id;
    }
  }

  /**
   * Returns the reqns last stage
   * @return database\stage
   * @access public
   */
  public function get_last_stage()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_last_stage' );
    $select->add_column( 'stage_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );

    $stage_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_id ? lib::create( 'database\stage', $stage_id ) : NULL;
  }

  /**
   * Returns the reqns last stage's stage type
   * @return database\stage_type
   * @access public
   */
  public function get_last_stage_type()
  {
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_last_stage' );
    $select->add_table_column( 'stage', 'stage_type_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->left_join( 'stage', 'reqn_last_stage.stage_id', 'stage.id' );
    $modifier->where( 'reqn_last_stage.reqn_id', '=', $this->id );

    $stage_type_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_type_id ? lib::create( 'database\stage_type', $stage_type_id ) : NULL;
  }

  /**
   * Returns the reqn's current stage type rank
   * @param integer $rank
   * @return boolean (may be NULL if the reqn has no rank)
   * @access public
   */
  public function get_current_rank()
  {
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_last_stage' );
    $select->add_table_column( 'stage_type', 'rank' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->left_join( 'stage', 'reqn_last_stage.stage_id', 'stage.id' );
    $modifier->left_join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->where( 'reqn_last_stage.reqn_id', '=', $this->id );

    return static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
  }

  /**
   * Adds the reqn to a stage
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
      log::warning( 'Tried to add stage to reqn with no primary key.' );
      return;
    }

    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $db_user = lib::create( 'business\session' )->get_user();
    $db_last_stage_type = $this->get_last_stage_type();

    // get the next stage_type
    $next_stage_type_list = is_null( $db_last_stage_type )
                          ? array()
                          : $db_last_stage_type->get_next_stage_type_list();

    $db_stage_type = NULL;
    if( is_null( $stage_type ) )
    {
      if( 1 < count( $next_stage_type_list ) )
        throw lib::create( 'exception\runtime',
          'Cannot add next default stage as more than one stage type is possible.', __METHOD__ );
      $db_stage_type = current( $next_stage_type_list );
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

    // make sure the stage type is appropriate
    if( is_null( $db_last_stage_type ) )
    {
      // we can only add the first stage when the reqn currently has no stages
      if( 1 != $db_stage_type->rank )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" but reqn has no existing stage.', $db_stage_type->name ),
          __METHOD__ );
    }
    else
    {
      $found = false;
      foreach( $next_stage_type_list as $db_next_stage_type )
      {
        if( $db_stage_type->id == $db_next_stage_type->id )
        {
          $found = true;
          break;
        }
      }

      if( !$found )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" which does not come after current stage "%s".',
                   $db_stage_type->name,
                   $db_last_stage_type->name ),
          __METHOD__ );
    }

    $db_stage = lib::create( 'database\stage' );
    $db_stage->reqn_id = $this->id;
    $db_stage->stage_type_id = $db_stage_type->id;
    $db_stage->datetime = util::get_datetime_object();
    $db_stage->user_id = $db_user->id;
    $db_stage->unprepared = is_null( $unprepared ) ? $db_stage_type->preperation_required : $unprepared;
    $db_stage->save();

    // if we have just entered the admin review stage then set the identifier
    if( 'Admin Review' == $db_stage_type->name )
    {
      $base = $this->get_deadline()->date->format( 'ym' );
      $this->identifier = $this->get_deadline()->get_next_identifier();
      $this->save();
    }
  }
}
