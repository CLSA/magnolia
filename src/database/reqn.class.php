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
  public function load()
  {
    parent::load();

    if( !is_null( $this->id ) )
    {
      $this->assert_deadline();
      $this->save();
    }
  }

  /**
   * Override the parent method
   */
  public function save()
  {
    // track if this is a new reqn
    $is_new = is_null( $this->id );

    // make sure the deadline is appropriate
    if( $is_new )
    {
      $this->assert_deadline();
      $this->data_directory = static::generate_data_directory();
    }

    parent::save();

    if( $is_new )
    {
      $this->create_version();
      $this->proceed_to_next_stage();
    }

    // delete files if they are being set to null
    if( is_null( $this->agreement_filename ) )
    {
      $filename = $this->get_filename( 'agreement' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->instruction_filename ) )
    {
      $filename = $this->get_filename( 'instruction' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $file_list = array();
    if( !is_null( $this->agreement_filename ) ) $file_list[] = $this->get_filename( 'agreement' );
    if( !is_null( $this->instruction_filename ) ) $file_list[] = $this->get_filename( 'instruction' );

    parent::delete();

    foreach( $file_list as $file ) unlink( $file );
  }

  /**
   * Creates a new version of the requisition
   * 
   * If no version exists then the first (empty) version will be created.  Otherwise the current version
   * will be copied exactly into a new version
   */
  public function create_version()
  {
    $db_current_reqn_version = $this->get_current_reqn_version();

    $db_reqn_version = lib::create( 'database\reqn_version' );
    $db_reqn_version->reqn_id = $this->id;
    $db_reqn_version->datetime = util::get_datetime_object();

    if( is_null( $db_current_reqn_version ) )
    {
      $db_reqn_version->version = 1;
    }
    else
    {
      $db_reqn_version->copy( $db_current_reqn_version );
      $db_reqn_version->version = $db_current_reqn_version->version + 1;
    }

    $db_reqn_version->save();

    if( !is_null( $db_current_reqn_version ) )
    {
      // copy the files as well
      copy( $db_current_reqn_version->get_filename( 'funding' ), $db_reqn_version->get_vilename( 'funding' ) );
      copy( $db_current_reqn_version->get_filename( 'ethics' ), $db_reqn_version->get_vilename( 'ethics' ) );
    }

    if( !is_null( $db_current_reqn_version ) )
    {
      // copy coapplicant records
      foreach( $db_current_reqn_version->get_coapplicant_object_list() as $db_coapplicant )
      {
        $db_new_coapplicant = lib::create( 'database\coapplicant' );
        $db_new_coapplicant->copy( $db_coapplicant );
        $db_new_coapplicant->reqn_version_id = $db_reqn_version->id;
        $db_new_coapplicant->save();
      }

      // copy reference records
      foreach( $db_current_reqn_version->get_reference_object_list() as $db_reference )
      {
        $db_new_reference = lib::create( 'database\reference' );
        $db_new_reference->copy( $db_reference );
        $db_new_reference->reqn_version_id = $db_reqn_version->id;
        $db_new_reference->save();
      }

      // copy reqn_version_data_option records
      foreach( $db_current_reqn_version->get_reqn_version_data_option_object_list() as $db_reqn_version_data_option )
      {
        $db_new_reqn_version_data_option = lib::create( 'database\reqn_version_data_option' );
        $db_new_reqn_version_data_option->copy( $db_reqn_version_data_option );
        $db_new_reqn_version_data_option->reqn_version_id = $db_reqn_version->id;
        $db_new_reqn_version_data_option->save();
      }
    }
  }

  /**
   * Returns the path to various files associated with the reqn
   * 
   * @param string $type Should be 'agreement' or 'instruction'
   * @return string
   * @access public
   */
  public function get_filename( $type )
  {
    $directory = '';
    if( 'agreement' == $type ) $directory = AGREEMENT_LETTER_PATH;
    else if( 'instruction' == $type ) $directory = INSTRUCTION_FILE_PATH;
    else throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );
    return sprintf( '%s/%s', $directory, $this->id );
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
      $db_current_stage_type = $this->get_current_stage_type();
      if( is_null( $db_current_stage_type ) || 1 == $db_current_stage_type->rank )
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
   * Returns the reqns current stage
   * @return database\stage
   * @access public
   */
  public function get_current_stage()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'stage' );
    $select->add_column( 'id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );
    $modifier->where( 'datetime', '=', NULL );

    $stage_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_id ? lib::create( 'database\stage', $stage_id ) : NULL;
  }

  /**
   * Returns the reqn's current stage type
   * @return database\stage_type
   * @access public
   */
  public function get_current_stage_type()
  {
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'stage' );
    $select->add_column( 'stage_type_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );
    $modifier->where( 'datetime', '=', NULL );

    $stage_type_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_type_id ? lib::create( 'database\stage_type', $stage_type_id ) : NULL;
  }

  /**
   * Returns the reqn's next stage type (NULL if there is no valid next stage type)
   * @return database\stage_type
   * @access public
   */
  public function get_next_stage_type()
  {
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );

    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $db_current_stage_type = $this->get_current_stage_type();
    $db_next_stage_type = NULL;
    if( is_null( $db_current_stage_type ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'rank', 1 );
    }
    else
    {
      $db_stage = $this->get_current_stage();
      $stage_type_list = $db_current_stage_type->get_next_possible_stage_type_object_list();
      if( 1 == count( $stage_type_list ) )
      {
        $db_next_stage_type = current( $stage_type_list );
      }
      else if( 1 < count( $stage_type_list ) )
      {
        if( 'DSAC Selection' == $db_current_stage_type->name )
        {
          // the DSAC Selection stage type is special, if it is complete then the next stage is DSAC Review
          foreach( $stage_type_list as $db_stage_type )
          {
            if( 'DSAC Review' == $db_stage_type->name )
            {
              $db_next_stage_type = $db_stage_type;
              break;
            }
          }
        }
        else if( 'Second DSAC Decision' == $db_current_stage_type->name )
        {
          $db_review = current( $db_stage->get_review_object_list() );
          if( $db_review )
          {
            $db_recommendation_type = $db_review->get_recommendation_type();
            if( !is_null( $db_recommendation_type ) )
            {
              if( 'Approved' == $db_recommendation_type->name )
              {
                foreach( $stage_type_list as $db_stage_type )
                {
                  if( 'Decision Made' == $db_stage_type->name )
                  {
                    $db_next_stage_type = $db_stage_type;
                    break;
                  }
                }
              }
              else
              {
                foreach( $stage_type_list as $db_stage_type )
                {
                  if( 'Second SMT Decision' == $db_stage_type->name )
                  {
                    $db_next_stage_type = $db_stage_type;
                    break;
                  }
                }
              }
            }
          }
        }
        else if( 'SMT Decision' == $db_current_stage_type->name )
        {
          $db_review = current( $db_stage->get_review_object_list() );
          if( $db_review )
          {
            $db_recommendation_type = $db_review->get_recommendation_type();
            if( !is_null( $db_recommendation_type ) )
            {
              if( 'Approved' == $db_recommendation_type->name || 'Not Approved' == $db_recommendation_type->name )
              {
                foreach( $stage_type_list as $db_stage_type )
                {
                  if( 'Decision Made' == $db_stage_type->name )
                  {
                    $db_next_stage_type = $db_stage_type;
                    break;
                  }
                }
              }
              else if( 'Revise' == $db_recommendation_type->name )
              {
                foreach( $stage_type_list as $db_stage_type )
                {
                  if( 'Revision Required' == $db_stage_type->name )
                  {
                    $db_next_stage_type = $db_stage_type;
                    break;
                  }
                }
              }
            }
          }
        }
        else if( 'Decision Made' == $db_current_stage_type->name )
        {
          // the decision for this reqn depends on one of several possible reviews
          $review_sel = lib::create( 'database\select' );
          $review_sel->add_table_column( 'review_type', 'name' );
          $review_sel->add_table_column( 'recommendation_type', 'name', 'recommendation' );
          $review_mod = lib::create( 'database\modifier' );
          $review_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
          $review_mod->join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
          $review_list = array();
          foreach( $this->get_review_list( $review_sel, $review_mod ) as $review )
            $review_list[$review['name']] = $review['recommendation'];

          $recommendation = NULL;
          // if there is a second SMT review then use that decision
          if( array_key_exists( 'Second SMT', $review_list ) ) $recommendation = $review_list['Second SMT'];
          // if there is a first SMT review then use that decision
          else if( array_key_exists( 'SMT', $review_list ) ) $recommendation = $review_list['SMT'];
          // if the chair approved their review then approve
          else if( array_key_exists( 'Chair', $review_list ) && 'Approved' == $review_list['Chair'] ) $recommendation = 'Approved';
          // if there is no chair review then do not approve (rejected before DSAC review)
          else if( !array_key_exists( 'Chair', $review_list ) ) $recommendation = 'Not Approved';

          if( !is_null( $recommendation ) )
          {
            foreach( $stage_type_list as $db_stage_type )
            {
              if( ( 'Approved' == $recommendation && 'Agreement' == $db_stage_type->name ) ||
                  ( 'Not Approved' == $recommendation && 'Not Approved' == $db_stage_type->name ) )
              {
                $db_next_stage_type = $db_stage_type;
                break;
              }
            }
          }
        }
      }
    }

    return $db_next_stage_type;
  }

  /**
   * Proceeds to the reqn to the next stage
   * 
   * The next stage is based on the current stage as well as the reqn's reviews
   * @access public
   */
  public function proceed_to_next_stage( $stage_type = NULL )
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to add stage to reqn with no primary key.' );
      return;
    }

    $review_class_name = lib::get_class_name( 'database\review' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $db_user = lib::create( 'business\session' )->get_user();
    $db_current_stage = $this->get_current_stage();
    $db_current_stage_type = is_null( $db_current_stage ) ? NULL : $db_current_stage->get_stage_type();

    $db_next_stage_type = NULL;
    if( is_null( $stage_type ) )
    {
      $db_next_stage_type = $this->get_next_stage_type();
      if( is_null( $db_next_stage_type ) )
        throw lib::create( 'exception\runtime',
          'Unable to proceed to next stage since there is currently no valid stage type available.', __METHOD__ );
    }
    else if( is_object( $stage_type ) )
    {
      if( is_a( $stage_type, lib::get_class_name( 'database\stage_type' ) ) ) $db_next_stage_type = $stage_type;
    }
    else if( is_integer( $stage_type ) || ( is_string( $stage_type ) && util::string_matches_int( $stage_type ) ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'rank', $stage_type );
    }
    else if( is_string( $stage_type ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'name', $stage_type );
    }

    if( is_null( $db_next_stage_type ) )
      throw lib::create( 'exception\argument', 'stage_type', $stage_type, __METHOD__ );

    // Note: there is a special circumstanse where a reqn is being rejected during the DSAC selection stage (make note here)
    $reject_selection = !is_null( $db_current_stage_type ) &&
                        'DSAC Selection' == $db_current_stage_type->name &&
                        'Decision Made' == $db_next_stage_type->name;

    // make sure the stage type is appropriate
    if( is_null( $db_current_stage_type ) )
    {
      // we can only add the first stage when the reqn currently has no stages
      if( 1 != $db_next_stage_type->rank )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" but reqn has no existing stage.', $db_next_stage_type->name ),
          __METHOD__ );
    }
    else
    {
      // make sure there the next stage comes after the current stage
      if( !$db_next_stage_type->comes_after( $db_current_stage_type ) )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" which does not come after current stage "%s".',
                   $db_next_stage_type->name,
                   $db_current_stage_type->name ),
          __METHOD__ );

      // determine whether we can safely proceed to the next stage (ignoring if the DSAC selection stage has been rejected)
      if( !$reject_selection )
      {
        $result = $db_current_stage->check_if_complete();
        if( true !== $result ) throw lib::create( 'exception\notice', $result, __METHOD__ );
      }
    }

    // save the user who completed the current stage
    if( !is_null( $db_current_stage ) )
    {
      $db_current_stage->user_id = $db_user->id;
      $db_current_stage->datetime = util::get_datetime_object();
      $db_current_stage->save();
    }

    // create the new stage
    $db_next_stage = lib::create( 'database\stage' );
    $db_next_stage->reqn_id = $this->id;
    $db_next_stage->stage_type_id = $db_next_stage_type->id;
    $db_next_stage->save();

    // if we have just entered the admin review stage then set the identifier and mark the version datetime
    if( 'Admin Review' == $db_next_stage_type->name )
    {
      $base = $this->get_deadline()->date->format( 'ym' );
      $this->identifier = $this->get_deadline()->get_next_identifier();
      $this->save();

      $db_reqn_version = $this->get_current_reqn_version();
      $db_reqn_version->datetime = util::get_datetime_object();
      $db_reqn_version->save();
    }
    // if we have just entered the active stage then create symbolic links to all data files and update file timestamps
    else if( 'Active' == $db_next_stage_type->name )
    {
      $this->refresh_study_data_files();
    }

    // manage any reviews associated with the current stage
    if( !is_null( $db_current_stage_type ) )
    {
      foreach( $db_current_stage_type->get_review_object_list( $this ) as $db_review )
      {
        if( $reject_selection )
        {
          // remove all reviews
          $db_review->delete();
        }
        else
        {
          // update the current stage's review's reviewer with the current user if it isn't already set
          if( is_null( $db_review->user_id ) )
          {
            $db_review->user_id = $db_user->id;
            $db_review->save();
          }
        }
      }
    }
  }

  /**
   * Returns this reqn's latest reqn_version record
   * 
   * @access public
   */
  public function get_current_reqn_version()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_current_reqn_version' );
    $select->add_column( 'reqn_version_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );

    $reqn_version_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $reqn_version_id ? lib::create( 'database\reqn_version', $reqn_version_id ) : NULL;
  }

  /**
   * Generates a text file listing this reqn's reviews
   * 
   * @access public
   */
  public function generate_reviews_file()
  {
    $db_user = $this->get_user();
    $db_graduate_user = $this->get_graduate_user();
    $db_reqn_version = $this->get_current_reqn_version();

    $text = sprintf(
      "Requisition: %s\n".
      "Title: %s\n".
      "Applicant: %s\n".
      "%s". // graduate only added if one exists
      "Lay Summary:\n".
      "%s\n",
      $this->identifier,
      $db_reqn_version->title,
      sprintf( '%s %s', $db_user->first_name, $db_user->last_name ),
      is_null( $db_graduate_user ) ?
        '' : sprintf( "Graduate: %s %s\n", $db_graduate_user->first_name, $db_graduate_user->last_name ),
      $db_reqn_version->lay_summary
    );

    $review_sel = lib::create( 'database\select' );
    $review_sel->add_table_column( 'user', 'first_name' );
    $review_sel->add_table_column( 'user', 'last_name' );
    $review_sel->add_column( 'date' );
    $review_sel->add_table_column( 'review_type', 'name', 'type' );
    $review_sel->add_table_column( 'recommendation_type', 'name', 'recommendation' );
    $review_sel->add_column( 'note' );

    $review_mod = lib::create( 'database\modifier' );
    $review_mod->left_join( 'user', 'review.user_id', 'user.id' );
    $review_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $review_mod->join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
    $review_mod->order( 'date' );
    $review_mod->order( 'stage_type_id' );

    foreach( $this->get_review_list( $review_sel, $review_mod ) as $review )
    {
      $text .= sprintf(
        "\n\nType: %s\n".
        "Reviewer: %s\n".
        "Created On: %s\n".
        "Recommendation: %s\n".
        "Notes:\n".
        "%s\n",
        $review['type'],
        is_null( $review['first_name'] ) ? '(none)' : $review['first_name'].' '.$review['last_name'],
        $review['date'],
        is_null( $review['recommendation'] ) ? '(none)' : $review['recommendation'],
        is_null( $review['note'] ) ? '(none)' : $review['note']
      );
    }

    // convert for Windows
    $text = iconv( 'UTF-8', 'Windows-1252//TRANSLIT', str_replace( "\n", "\r\n", $text ) );

    $filename = sprintf( '%s/%s.txt', DATA_REVIEWS_PATH, $this->id );
    if( false === file_put_contents( $filename, $text, LOCK_EX ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate reviews text file "%s" for requisition %s',
          $filename,
          $this->identifier
        ),
        __METHOD__
      );
    }
  }

  /**
   * Provides a new temporary identifier which doesn't already exist
   * 
   * @access public
   */
  public static function get_temporary_identifier()
  {
    $count = 0;
    $modifier = NULL;
    do
    {
      // guard against an infinite loop
      if( $count++ > 1000 ) throw lib::create( 'exception\runtime', 'Unable to create a new temporary identifier.', __METHOD__ );

      // pick a random number
      $identifier = 'T'.rand( 10000, 99999 );

      // see if it is already in use
      $modifier = lib::create( 'database\modifier' );
      $modifier->where( 'identifier', '=', $identifier );
    } while( static::count( $modifier ) );

    return $identifier;
  }

  /**
   * Returns the requisition's study-data paths
   * 
   * @param string $type One of "data" or "web"
   * @return string
   */
  public function get_study_data_path( $type )
  {
    if( !in_array( $type, array( 'data', 'web' ) ) ) throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );
    return sprintf( '%s/%s/%s', STUDY_DATA_PATH, $type, $this->data_directory );
  }

  /**
   * Returns the number of days left before the reqn's study-data will expire
   * 
   * @return integer
   */
  public function get_study_data_expiry()
  {
    $setting_manager = lib::create( 'business\setting_manager' );

    $data_path = $this->get_study_data_path( 'data' );

    // get any file in the reqn's data directory
    $list = glob( $data_path.'/*' );
    if( false === $list )
    {
      log::warning( sprintf( 'Unable to list contents of the data directory belonging to requisition "%s" (%s)',
        $this->identifier,
        $data_path
      ) );
      return 0;
    }

    $filename = NULL;
    foreach( $list as $file )
    {
      if( is_file( $file ) )
      {
        $filename = $file;
        break;
      }
    }

    if( is_null( $filename ) ) return 0;

    $timestamp = filemtime( $filename );
    if( false === $timestamp )
    {
      log::warning( sprintf( 'Unable to get modification time of data file belonging to requisition "%s" (%s)',
        $this->identifier,
        $filename
      ) );
      return 0;
    }

    $now = util::get_datetime_object();
    $datetime_obj = util::get_datetime_object();
    $datetime_obj->setTimestamp( $timestamp );
    $days = $setting_manager->get_setting( 'general', 'study_data_expiry' ) - $datetime_obj->diff( $now )->days;
    return 0 > $days ? 0 : $days;
  }

  /**
   * Returns the number of days left before the reqn's study-data will expire
   * 
   * @return integer
   */
  public function get_graduate_user()
  {
    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_table_column( 'graduate', 'graduate_user_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'graduate', 'reqn.graduate_id', 'graduate.id' );
    $modifier->where( 'reqn.id', '=', $this->id );

    $user_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return is_null( $user_id ) ? NULL : lib::create( 'database\user', $user_id );
  }

  /**
   * Refreshes links to all study data files, resets the file-removal countdown timer, and copies supplemental files
   */
  public function refresh_study_data_files()
  {
    $supplemental_file_class_name = lib::get_class_name( 'database\supplemental_file' );
    $data_path = $this->get_study_data_path( 'data' );
    $web_path = $this->get_study_data_path( 'web' );
    $db_reqn_version = $this->get_current_reqn_version();

    // delete all existing links
    util::exec_timeout( sprintf( 'rm -rf %s/*', $web_path ) );

    // refresh links
    $list = glob( $data_path.'/*' );
    if( false !== $list )
    {
      foreach( $list as $file )
      {
        if( is_file( $file ) )
        {
          // update the file's timestamp to reset the link removal counter
          touch( $file );

          // create a link if one doesn't already exist
          $filename = sprintf( '../../data/%s%s', $this->data_directory, str_replace( $data_path, '', $file ) );
          $link = str_replace( $data_path, $web_path, $file );

          // create a relative link to the data file
          $result = symlink( $filename, $link );
          if( !$result )
          {
            throw lib::create( 'exception\runtime', sprintf(
              'Unable to create link to "%s" named "%s".',
              $link,
              $filename
            ), __METHOD__ );
          }
        }
      }
    }

    // add the instructions
    $filename = $db_reqn_version->get_filename( 'instruction' );
    if( is_file( $filename ) )
    {
      $link = sprintf( '%s/%s', $web_path, $db_reqn_version->instruction_filename );
      $result = symlink( $filename, $link );
      if( !$result )
      {
        throw lib::create( 'exception\runtime', sprintf(
          'Unable to create link to "%s" named "%s".',
          $link,
          $filename
        ), __METHOD__ );
      }
    }

    // add all supplemental files
    $lang = $this->get_language()->code;
    foreach( $supplemental_file_class_name::select_objects() as $db_supplemental_file )
    {
      $name = sprintf( 'name_%s', $lang );
      $filename = $db_supplemental_file->get_filename( $lang );
      $link = sprintf( '%s/%s', $web_path, $db_supplemental_file->$name );

      if( is_file( $filename ) )
      {
        $result = symlink( $filename, $link );
        if( !$result )
        {
          throw lib::create( 'exception\runtime', sprintf(
            'Unable to create link to "%s" named "%s".',
            $link,
            $filename
          ), __METHOD__ );
        }
      }
    }
  }

  /**
   * Creates a unique directory for study data and returns the directory name
   * 
   * @access public
   * @return string
   */
  public static function generate_data_directory()
  {
    $count = 0;
    while( 100 > $count++ )
    {
      $name = sprintf(
        '%s-%s-%s-%s',
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) )
      );

      // create the data directory
      $path = sprintf( '%s/data/%s', STUDY_DATA_PATH, $name );
      if( !file_exists( $path ) )
      {
        if( !mkdir( $path ) )
          throw lib::create( 'exception\runtime', sprintf( 'Unable to create data directory "%s"', $path ), __METHOD__ );
        return $name;
      }

      // create the web directory
      $path = sprintf( '%s/web/%s', STUDY_DATA_PATH, $name );
      if( !file_exists( $path ) )
      {
        if( !mkdir( $path ) )
          throw lib::create( 'exception\runtime', sprintf( 'Unable to create data directory "%s"', $path ), __METHOD__ );
        return $name;
      }
    }

    // if we get here then something is wrong
    throw lib::create( 'exception\runtime', 'Unable to create unique data directory.', __METHOD__ );
  }
}
