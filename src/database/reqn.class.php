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
    if( $is_new ) $this->assert_deadline();

    // track whether the trainee_id has changed to NULL
    $remove_trainee_details = $this->has_column_changed( 'trainee_user_id' ) && !is_null( $this->trainee_user_id );

    parent::save();

    if( $is_new )
    {
      $this->create_version();
      $this->proceed_to_next_stage();
    }
    else if( $remove_trainee_details )
    {
      // do not allow trainee details or a fee waiver if there is no trainee selected
      $db_current_reqn_version = $this->get_current_reqn_version();
      $db_current_reqn_version->trainee_program = NULL;
      $db_current_reqn_version->trainee_institution = NULL;
      $db_current_reqn_version->trainee_address = NULL;
      $db_current_reqn_version->trainee_phone = NULL;
      $db_current_reqn_version->waiver = NULL;
      $db_current_reqn_version->save();
    }

    // delete files if they are being set to null
    if( is_null( $this->instruction_filename ) )
    {
      $filename = $this->get_filename( 'instruction' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }

  /**
   * Change deadline when changing the reqn-type
   */
  public function __set( $column_name, $value )
  {
    parent::__set( $column_name, $value );

    if( 'reqn_type_id' == $column_name )
    {
      if( $this->legacy || !$this->get_reqn_type()->is_deadline_required() ) $this->deadline_id = NULL;
      $this->assert_deadline();
    }
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $file_list = array();
    if( !is_null( $this->instruction_filename ) ) $file_list[] = $this->get_filename( 'instruction' );

    parent::delete();

    foreach( $file_list as $file ) if( file_exists( $file ) ) unlink( $file );
  }

  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    // convert final_report_id to reqn_id
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'final_report_id=', $identifier ) )
    {
      $regex = '/final_report_id=([0-9]+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        try
        {
          $db_final_report = lib::create( 'database\final_report', $matches[1] );
          $db_reqn = lib::create( 'database\reqn', $db_final_report->reqn_id );
          $identifier = $db_reqn->id;
        }
        catch( \cenozo\exception\runtime $e )
        {
          // A runtime exception means the final report or reqn doesn't exist, so leave the identifier unchanged
        }
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }

  /**
   * Returns whether the reqn is using a full ethics approval list or a single-file ethics system
   * 
   * All reqns start with a simple one-file ethics system.  Once they've reached the active stage and if
   * they are not exempt from ethics a list of ethics approvals is used instead.
   */
  public function has_ethics_approval_list()
  {
    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->where( 'stage_type.name', '=', 'Active' );
    return 'yes' == $this->get_current_reqn_version()->ethics && 0 < $this->get_stage_count( $modifier );
  }

  /**
   * Creates a new version of the requisition
   * 
   * If no version exists then the first (empty) version will be created.  Otherwise the current version
   * will be copied exactly into a new version
   * 
   * @param boolean $new_amendment Whether to create a new amendment when creating the version
   * @param database\reqn_version $db_clone_reqn_version Which reqn_version to copy (default is this reqn's current)
   */
  public function create_version( $new_amendment = false, $db_clone_reqn_version = NULL )
  {
    $reqn_version_comment_class_name = lib::get_class_name( 'database\reqn_version_comment' );
    $data_justification_class_name = lib::get_class_name( 'database\data_justification' );
    $amendment_justification_class_name = lib::get_class_name( 'database\amendment_justification' );

    // first get the current reqn version to determine the next version number
    $db_current_reqn_version = $this->get_current_reqn_version();
    $version = is_null( $db_current_reqn_version ) || $new_amendment ? 1 : $db_current_reqn_version->version + 1;

    // now set the clone version (use the current if none is provided)
    if( is_null( $db_clone_reqn_version ) ) $db_clone_reqn_version = $db_current_reqn_version;

    // create the new record and copy the clone record (if it exists)
    $db_reqn_version = lib::create( 'database\reqn_version' );
    if( !is_null( $db_current_reqn_version ) ) $db_reqn_version->copy( $db_clone_reqn_version );

    // define some of the column values insetad of using the clone
    $db_reqn_version->reqn_id = $this->id;
    $db_reqn_version->datetime = util::get_datetime_object();
    $db_reqn_version->version = $version;
    $db_reqn_version->agreement_filename = NULL;
    $db_reqn_version->agreement_start_date = NULL;
    $db_reqn_version->agreement_end_date = NULL;

    // determine the amendment
    if( $new_amendment )
    {
      // go to the next amendment (starting with A)
      if( '.' == $db_reqn_version->amendment ) $db_reqn_version->amendment = 'A';
      else $db_reqn_version->amendment++;
    }
    $db_reqn_version->save();

    if( !is_null( $db_clone_reqn_version ) )
    {
      // copy the files as well
      $existing_file = $db_clone_reqn_version->get_filename( 'peer_review' );
      if( file_exists( $existing_file ) ) copy( $existing_file, $db_reqn_version->get_filename( 'peer_review' ) );

      $existing_file = $db_clone_reqn_version->get_filename( 'funding' );
      if( file_exists( $existing_file ) ) copy( $existing_file, $db_reqn_version->get_filename( 'funding' ) );

      $existing_file = $db_clone_reqn_version->get_filename( 'ethics' );
      if( file_exists( $existing_file ) ) copy( $existing_file, $db_reqn_version->get_filename( 'ethics' ) );

      $existing_file = $db_clone_reqn_version->get_filename( 'data_sharing' );
      if( file_exists( $existing_file ) ) copy( $existing_file, $db_reqn_version->get_filename( 'data_sharing' ) );

      // only copy amendment types if this is not a new amendment
      if( !$new_amendment )
      {
        $amendment_type_list = array();
        $select = lib::create( 'database\select' );
        $select->add_column( 'id' );
        foreach( $db_clone_reqn_version->get_amendment_type_list( $select ) as $amendment_type )
          $amendment_type_list[] = $amendment_type['id'];

        if( 0 < count( $amendment_type_list ) ) $db_reqn_version->add_amendment_type( $amendment_type_list );

        // include any amendment justifications
        foreach( $db_clone_reqn_version->get_amendment_justification_object_list() as $db_amendment_j_clone )
        {
          $db_amendment_justification = $amendment_justification_class_name::get_unique_record(
            array( 'reqn_version_id', 'amendment_type_id' ),
            array( $db_reqn_version->id, $db_amendment_j_clone->amendment_type_id )
          );
          if( is_null( $db_amendment_justification ) )
          {
            $db_amendment_justification = lib::create( 'database\amendment_justification' );
            $db_amendment_justification->reqn_version_id = $db_reqn_version->id;
            $db_amendment_justification->amendment_type_id = $db_amendment_j_clone->amendment_type_id;
          }

          $db_amendment_justification->description = $db_amendment_j_clone->description;
          $db_amendment_justification->save();
        }
      }

      // copy coapplicant records
      foreach( $db_clone_reqn_version->get_coapplicant_object_list() as $db_coapplicant )
      {
        $db_new_coapplicant = lib::create( 'database\coapplicant' );
        $db_new_coapplicant->copy( $db_coapplicant );
        $db_new_coapplicant->reqn_version_id = $db_reqn_version->id;
        $db_new_coapplicant->save();
      }

      // copy reference records
      foreach( $db_clone_reqn_version->get_reference_object_list() as $db_reference )
      {
        $db_new_reference = lib::create( 'database\reference' );
        $db_new_reference->copy( $db_reference );
        $db_new_reference->reqn_version_id = $db_reqn_version->id;
        $db_new_reference->save();
      }

      // copy data_selection records
      $data_selection_id_list = array();
      $data_selection_sel = lib::create( 'database\select' );
      $data_selection_sel->add_column( 'id' );
      foreach( $db_clone_reqn_version->get_data_selection_list( $data_selection_sel ) as $data_selection )
        $data_selection_id_list[] = $data_selection['id'];
      if( 0 < count( $data_selection_id_list ) ) $db_reqn_version->add_data_selection( $data_selection_id_list );

      // copy all comments
      foreach( $db_clone_reqn_version->get_reqn_version_comment_object_list() as $db_reqn_version_comment_clone )
      {
        $db_reqn_version_comment = $reqn_version_comment_class_name::get_unique_record(
          array( 'reqn_version_id', 'data_category_id' ),
          array( $db_reqn_version->id, $db_reqn_version_comment_clone->data_category_id )
        );
        $db_reqn_version_comment->description = $db_reqn_version_comment_clone->description;
        $db_reqn_version_comment->save();
      }

      // copy all data justifications
      foreach( $db_clone_reqn_version->get_data_justification_object_list() as $db_data_j_clone )
      {
        $db_data_justification = $data_justification_class_name::get_unique_record(
          array( 'reqn_version_id', 'data_option_id' ),
          array( $db_reqn_version->id, $db_data_j_clone->data_option_id )
        );
        if( is_null( $db_data_justification ) )
        {
          $db_data_justification = lib::create( 'database\data_justification' );
          $db_data_justification->reqn_version_id = $db_reqn_version->id;
          $db_data_justification->data_option_id = $db_data_j_clone->data_option_id;
        }

        $db_data_justification->description = $db_data_j_clone->description;
        $db_data_justification->save();
      }
    }
  }

  /**
   * Creates a new version of the requisition's final report
   * 
   * If no final report exists then the first (empty) version will be created.  Otherwise the current final report
   * will be copied exactly into a new version
   */
  public function create_final_report()
  {
    // first get the current final_report to determine the next version number
    $db_current_final_report = $this->get_current_final_report();
    $version = is_null( $db_current_final_report ) ? 1 : $db_current_final_report->version + 1;

    // create the new record and copy the current record (if it exists)
    $db_final_report = lib::create( 'database\final_report' );
    if( !is_null( $db_current_final_report ) ) $db_final_report->copy( $db_current_final_report );

    // define some of the column values insetad of using the clone
    $db_final_report->reqn_id = $this->id;
    $db_final_report->datetime = util::get_datetime_object();
    $db_final_report->version = $version;
    $db_final_report->save();
  }

  /**
   * Returns the path to various files associated with the reqn
   * 
   * @param string $type Should be 'agreement', 'instruction', or 'reviews'
   * @return string
   * @access public
   */
  public function get_filename( $type )
  {
    $directory = '';
    if( 'agreements' == $type ) return sprintf( '%s/%s.zip', AGREEMENT_LETTER_PATH, $this->id );
    else if( 'instruction' == $type ) $directory = INSTRUCTION_FILE_PATH;
    else if( 'reviews' == $type ) return sprintf( '%s/%s.txt', DATA_REVIEWS_PATH, $this->id );
    else throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );
    return sprintf( '%s/%s', $directory, $this->id );
  }

  /**
   * Returns the reqn's calculated recommendation based on all reviews
   * 
   * @return string ("Approved" or "Not Approved")
   * @access public
   */
  public function get_recommendation()
  {
    // the decision for this reqn depends on one of several possible reviews
    $review_sel = lib::create( 'database\select' );
    $review_sel->add_table_column( 'review_type', 'name' );
    $review_sel->add_table_column( 'recommendation_type', 'name', 'recommendation' );
    $review_mod = lib::create( 'database\modifier' );
    $review_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $review_mod->join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );

    // make sure to only get reviews for the current amendment
    $review_mod->join( 'reqn_current_reqn_version', 'review.reqn_id', 'reqn_current_reqn_version.reqn_id' );
    $review_mod->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $review_mod->where( 'review.amendment', '=', 'reqn_version.amendment', false );

    $review_list = array();
    foreach( $this->get_review_list( $review_sel, $review_mod ) as $review )
      $review_list[$review['name']] = $review['recommendation'];

    $recommendation = NULL;
    // if there is a second EC review then use that decision
    if( array_key_exists( 'Second EC', $review_list ) ) $recommendation = $review_list['Second EC'];
    // if there is a second chair review then use that decision
    else if( array_key_exists( 'Second Chair', $review_list ) ) $recommendation = $review_list['Second Chair'];
    // if there is a first EC review then use that decision
    else if( array_key_exists( 'EC', $review_list ) ) $recommendation = $review_list['EC'];
    // if there is a first chair review then use that decision
    else if( array_key_exists( 'Chair', $review_list ) ) $recommendation = $review_list['Chair'];
    // if there is a Feasibility review then use that decision
    else if( array_key_exists( 'Feasibility', $review_list ) && 'Unable to Assess' != $review_list['Feasibility'] )
      $recommendation = 'Not Feasible' == $review_list['Feasibility'] ? 'Not Approved' : 'Approved';
    // if there is an admin review then use that decision
    else if( array_key_exists( 'Admin', $review_list ) )
      $recommendation = 'Not Satisfactory' == $review_list['Admin'] ? 'Not Approved' : 'Approved';

    return $recommendation;
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
      // no current stage means the next stage is the first stage
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'rank', 1 );
    }
    else
    {
      $stage_type_list = $db_current_stage_type->get_next_possible_stage_type_object_list();

      if( 1 == count( $stage_type_list ) )
      {
        $db_next_stage_type = current( $stage_type_list );
      }
      else
      {
        $find_stage_type_name = NULL;

        if( 'DSAC Selection' == $db_current_stage_type->name )
        {
          // always proceed to the DSAC Review stage (it goes to decision made when it is rejected)
          $find_stage_type_name = 'DSAC Review';
        }
        else if( 'EC Decision' == $db_current_stage_type->name )
        {
          // if revise then go to revision required, otherwise go to decision made
          $db_review = current( $this->get_current_stage()->get_review_object_list() );
          if( $db_review )
          {
            $db_recommendation_type = $db_review->get_recommendation_type();
            if( !is_null( $db_recommendation_type ) )
            {
              $find_stage_type_name = false !== strpos( $db_recommendation_type->name, 'Revise' )
                                    ? 'Revision Required'
                                    : 'Decision Made';
            }
          }
        }
        else if( 'Second DSAC Decision' == $db_current_stage_type->name )
        {
          // if approved then go to decision made, otherwise go to the second EC decision
          $db_review = current( $this->get_current_stage()->get_review_object_list() );
          if( $db_review )
          {
            $db_recommendation_type = $db_review->get_recommendation_type();
            if( !is_null( $db_recommendation_type ) )
              $find_stage_type_name = 'Approved' == $db_recommendation_type->name ? 'Decision Made' : 'Second EC Decision';
          }
        }
        else if( 'Decision Made' == $db_current_stage_type->name )
        {
          $recommendation = $this->get_recommendation();
          if( !is_null( $recommendation ) )
          {
            // NOTE: when approved check if this is not an amendment and revisions have been suggested
            $amendment = $this->get_current_reqn_version()->amendment;
            $find_stage_type_name = 'Approved' == $recommendation
                                  ? ( '.' == $amendment && $this->suggested_revisions ? 'Suggested Revisions' : 'Agreement' )
                                  : 'Not Approved';
          }
        }

        // now find the approrpiate stage type
        if( !is_null( $find_stage_type_name ) )
        {
          foreach( $stage_type_list as $db_stage_type )
          {
            if( $find_stage_type_name == $db_stage_type->name )
            {
              $db_next_stage_type = $db_stage_type;
              break;
            }
          }
        }
      }
    }

    // keep going to the next stage type until we find one that this reqn's type uses
    while( !is_null( $db_next_stage_type ) )
    {
      $stage_type_mod = lib::create( 'database\modifier' );
      $stage_type_mod->where( 'stage_type.id', '=', $db_next_stage_type->id );
      if( 0 < $this->get_reqn_type()->get_stage_type_count( $stage_type_mod ) ) break;
      $db_next_stage_type = $db_next_stage_type->get_default_next_stage_type();
    }

    return $db_next_stage_type;
  }

  /**
   * Reverses the current stage, returning to the previous one
   * @access public
   */
  public function reverse_to_last_stage()
  {
    // get the previous stage
    $stage_mod = lib::create( 'database\modifier' );
    $stage_mod->where( 'stage.datetime', '!=', NULL );
    $stage_mod->order_desc( 'stage.datetime' );
    $stage_mod->limit( 1 );
    $stage_list = $this->get_stage_object_list( $stage_mod );
    if( 0 == count( $stage_list ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Tried to reverse requisition %s to previous stage but no appropriate stage found.',
          $this->identifier
        ),
        __METHOD__
      );
    }
    $db_last_stage = current( $stage_list );

    // if deferred then we need to un-defer
    if( 'deferred' == $this->state )
    {
      $this->state = NULL;
      $this->save();
    }

    $this->get_current_stage()->delete();
    $db_last_stage->datetime = NULL;
    $db_last_stage->save();
  }

  /**
   * Proceeds to the reqn to the next stage
   * 
   * The next stage is based on the current stage as well as the reqn's reviews
   * @param mixed $stage_type The next stage (a stage_type record, rank or name or NULL will automatically pick the next stage)
   * @param boolean $start_amendment Whether the next stage is to start a new amendment
   * @access public
   */
  public function proceed_to_next_stage( $stage_type = NULL, $start_amendment = false )
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to add stage to reqn with no primary key.' );
      return;
    }

    $user_class_name = lib::get_class_name( 'database\user' );
    $notification_class_name = lib::get_class_name( 'database\notification' );
    $review_class_name = lib::get_class_name( 'database\review' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $setting_manager = lib::create( 'business\setting_manager' );
    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_application = $session->get_application();
    $db_current_stage = $this->get_current_stage();
    $db_current_stage_type = is_null( $db_current_stage ) ? NULL : $db_current_stage->get_stage_type();
    $db_reqn_type = $this->get_reqn_type();
    $db_reqn_version = $this->get_current_reqn_version();

    $db_next_stage_type = NULL;
    if( is_null( $stage_type ) )
    {
      $db_next_stage_type = $start_amendment
                          ? $stage_type_class_name::get_unique_record( 'name', 'Admin Review' )
                          : $this->get_next_stage_type();

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

    // if moving to the data release or active stage then check for the correct linked-data agreement and approval
    if( 'Data Release' == $db_next_stage_type->name || 'Active' == $db_next_stage_type->name )
    {
      if( $db_reqn_version->has_linked_data() &&
          ( is_null( $db_reqn_version->data_sharing_filename ) || !$this->data_sharing_approved ) )
      {
        throw lib::create( 'exception\notice',
          sprintf(
            'Unable to proceed to the %s stage as this requisition requests linked data without an approved data sharing agreement.',
            $db_next_stage_type->name
          ),
          __METHOD__
        );
      }
    }

    // Note: there is a special circumstance where a reqn is being rejected during the DSAC selection stage (make note here)
    $reject_selection = !is_null( $db_current_stage_type ) &&
                        'DSAC Selection' == $db_current_stage_type->name &&
                        'Decision Made' == $db_next_stage_type->name;

    $incomplete = 'Incomplete' == $db_next_stage_type->name;
    $withdrawn = 'Withdrawn' == $db_next_stage_type->name;

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
      if( $incomplete && '.' != $db_reqn_version->amendment )
      {
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to move amendment into "%s" stage.', $db_next_stage_type->name ),
          __METHOD__ );
      }

      // Determine whether we can safely proceed to the next stage (ignoring if the DSAC selection stage has been rejected or
      // if we're moving the reqn to the permanently incomplete stage
      if( !( $reject_selection || $start_amendment || $incomplete || $withdrawn ) )
      {
        $result = $db_current_stage->check_if_complete();
        if( true !== $result ) throw lib::create( 'exception\notice', $result, __METHOD__ );
      }
    }

    if( !is_null( $db_current_stage ) )
    {
      // save the user who completed the current stage
      $db_current_stage->user_id = $db_user->id;
      $db_current_stage->datetime = util::get_datetime_object();
      $db_current_stage->save();

      // send any notifications associated with the current stage (incomplete and withdrawn have their own special notifications)
      $db_notification_type = NULL;
      if( $incomplete ) $db_notification_type = $notification_type_class_name::get_unique_record( 'name', 'Incomplete' );
      else if( $withdrawn ) $db_notification_type = $notification_type_class_name::get_unique_record( 'name', 'Withdrawn' );
      else $db_notification_type = $db_current_stage_type->get_notification_type();

      if( !( $start_amendment || is_null( $db_notification_type ) ) )
      {
        $db_notification = lib::create( 'database\notification' );
        $db_notification->notification_type_id = $db_notification_type->id;
        $db_notification->set_reqn( $this ); // this saves the record
        $db_notification->mail();
      }
      else
      {
        $db_reqn_user = $this->get_user();
        if( $start_amendment ) $subject = sprintf( 'Amendment %s started', $db_reqn_version->amendment );
        else if( $incomplete ) $subject = $db_next_stage_type->name;
        else $subject = sprintf( '%s complete', $db_current_stage_type->name );
        $notification_class_name::mail_admin(
          sprintf(
            'Requisition %s: %s',
            $this->identifier,
            $subject
          ),
          sprintf(
            "The following requisition has moved from \"%s\" to \"%s\":\n".
            "\n".
            "Type: %s\n".
            "Identifier: %s\n".
            "Amendment: %s\n".
            "Applicant: %s %s\n".
            "Title: %s\n",
            $db_current_stage_type->name,
            $db_next_stage_type->name,
            $db_reqn_type->name,
            $this->identifier,
            str_replace( '.', 'no', $db_reqn_version->amendment ),
            $db_reqn_user->first_name, $db_reqn_user->last_name,
            $db_reqn_version->title
          )
        );
      }
    }

    // create the new stage
    $db_next_stage = lib::create( 'database\stage' );
    $db_next_stage->reqn_id = $this->id;
    $db_next_stage->stage_type_id = $db_next_stage_type->id;
    $db_next_stage->save();

    if( 'Admin Review' == $db_next_stage_type->name )
    {
      // we don't need to do this step if this is a new amendment
      if( !$start_amendment )
      {
        // if we have just entered the admin review stage then set the identifier...
        $this->identifier = $db_reqn_type->is_deadline_required()
                          ? $this->get_deadline()->get_next_identifier()
                          : $db_reqn_type->get_next_identifier();
        $this->save();

        // ...and mark the version datetime
        $db_reqn_version->datetime = util::get_datetime_object();

        // ...and set the waiver to none if the reqn is not eligible
        if( is_null( $this->trainee_user_id ) || (
          !is_null( $db_reqn_version->applicant_country_id ) &&
          $db_application->country_id != $db_reqn_version->applicant_country_id &&
          !is_null( $db_reqn_version->trainee_country_id ) &&
          $db_application->country_id != $db_reqn_version->trainee_country_id
        ) ) $db_reqn_version->waiver = 'none';

        $db_reqn_version->save();
      }
    }
    // if we have just entered the DSAC review stage then alert the reviewers who are assigned to a review
    else if( 'DSAC Review' == $db_next_stage_type->name )
    {
      $db_notification_type = $notification_type_class_name::get_unique_record( 'name', 'Review Assigned' );
      $review_sel = lib::create( 'database\select' );
      $review_sel->add_table_column( 'user', 'first_name' );
      $review_sel->add_table_column( 'user', 'last_name' );
      $review_sel->add_table_column( 'user', 'email' );
      $review_mod = lib::create( 'database\modifier' );
      $review_mod->join( 'user', 'review.user_id', 'user.id' );
      $review_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
      $review_mod->where( 'review_type.name', 'LIKE', 'Reviewer %' );
      $review_mod->where( 'recommendation_type_id', '=', NULL );

      // make sure to only get reviews for the current amendment
      $review_mod->join( 'reqn_current_reqn_version', 'review.reqn_id', 'reqn_current_reqn_version.reqn_id' );
      $review_mod->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
      $review_mod->where( 'review.amendment', '=', 'reqn_version.amendment', false );

      $review_list = $this->get_review_list( $review_sel, $review_mod );

      if( 0 < count( $review_list ) )
      {
        // send a notification
        $db_notification = lib::create( 'database\notification' );
        $db_notification->reqn_id = $this->id;
        $db_notification->notification_type_id = $db_notification_type->id;
        $db_notification->datetime = util::get_datetime_object();
        $db_notification->save();

        foreach( $review_list as $review )
        {
          $db_notification->add_email(
            $review['email'],
            sprintf( '%s %s', $review['first_name'], $review['last_name'] )
          );
        }

        $db_notification->mail();
      }
    }
    // if we're recommending a revision then automatically defer the reqn
    else if( 'Suggested Revisions' == $db_next_stage_type->name )
    {
      $this->state = 'deferred';
      $this->save();

      // create a new reqn version
      $this->create_version();

      // do not send a notification since there is one already sent after leaving the Decision Made stage
    }
    // when going to the data release stage generate the data directory
    else if( 'Data Release' == $db_next_stage_type->name )
    {
      $this->generate_data_directory();
    }
    else if( 'Agreement' == $db_next_stage_type->name )
    {
      // Check if there is an amendment to change the primary applicant, and if so change it now
      // This can happen for regular or legacy applications
      if( '.' != $db_reqn_version->amendment &&
          !is_null( $db_reqn_version->new_user_id ) &&
          $this->user_id != $db_reqn_version->new_user_id &&
          'Approved' == $this->get_recommendation() )
      {
        $this->change_user();
      }
    }
    else if( 'Active' == $db_next_stage_type->name )
    {
      // Check if there is an amendment to change the primary applicant, and if so change it now
      // This can only happen for legacy applications (since the agreement can be skipped)
      if( $this->legacy &&
          '.' != $db_reqn_version->amendment &&
          !is_null( $db_reqn_version->new_user_id ) &&
          $this->user_id != $db_reqn_version->new_user_id )
      {
        $this->change_user();
      }

      // create the data directories now in case the data-release stage was never passed through (legacy reqns)
      $this->generate_data_directory();

      // if we have just entered the active stage then create symbolic links to all data files and update file timestamps
      $this->refresh_study_data_files();

      // if ethics is "yes" then copy ethics file to the ethics_approval list
      // however, only do this the first time we get to active, do not repeat when going through an amendment
      if( '.' == $db_reqn_version->amendment &&
          'yes' == $db_reqn_version->ethics &&
          !is_null( $db_reqn_version->ethics_filename ) )
      {
        // create the database record
        $db_ethics_approval = lib::create( 'database\ethics_approval' );
        $db_ethics_approval->reqn_id = $this->id;
        $db_ethics_approval->filename = $db_reqn_version->ethics_filename;
        $db_ethics_approval->date = is_null( $db_reqn_version->ethics_date )
                                  ? util::get_datetime_object()
                                  : $db_reqn_version->ethics_date;
        $db_ethics_approval->save();

        // and also copy the ethics file
        copy( $db_reqn_version->get_filename( 'ethics' ), $db_ethics_approval->get_filename() );
      }
    }
    // if the final report is now required then automatically defer the reqn
    else if( 'Report Required' == $db_next_stage_type->name )
    {
      $this->state = 'deferred';
      $this->save();

      // create a new final report
      $this->create_final_report();

      // do not send a notification since there is one already sent after leaving the Decision Made stage
    }
    // if we have just entered the Communications review stage then alert all communications users
    else if( 'Communications Review' == $db_next_stage_type->name )
    {
      $db_notification_type = $notification_type_class_name::get_unique_record( 'name', 'Communication Review' );

      // send a notification
      $db_notification = lib::create( 'database\notification' );
      $db_notification->reqn_id = $this->id;
      $db_notification->notification_type_id = $db_notification_type->id;
      $db_notification->datetime = util::get_datetime_object();
      $db_notification->save();

      $user_mod = lib::create( 'database\modifier' );
      $user_mod->join( 'access', 'user.id', 'access.user_id' );
      $user_mod->join( 'role', 'access.role_id', 'role.id' );
      $user_mod->where( 'user.active', '=', true );
      $user_mod->where( 'user.email', '!=', NULL );
      $user_mod->where( 'role.name', '=', 'communication' );
      foreach( $user_class_name::select_objects( $user_mod ) as $db_user )
      {
        // don't include if this is an admin (since they already get an admin email)
        $access_mod = lib::create( 'database\modifier' );
        $access_mod->join( 'role', 'access.role_id', 'role.id' );
        $access_mod->where( 'role.name', '=', 'administrator' );
        if( 0 == $db_user->get_access_count( $access_mod ) )
        {
          $db_notification->add_email(
            $db_user->email,
            sprintf( '%s %s', $db_user->first_name, $db_user->last_name )
          );
        }
      }

      $db_notification->mail();
    }
    else if( $incomplete || $withdrawn )
    {
      $this->state = NULL;
      $this->save();
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
        else if( !( $incomplete || $withdrawn ) )
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
   * Returns this reqn's latest final_report record
   * 
   * @access public
   */
  public function get_current_final_report()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_current_final_report' );
    $select->add_column( 'final_report_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );

    $final_report_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $final_report_id ? lib::create( 'database\final_report', $final_report_id ) : NULL;
  }

  /**
   * Updates the reqn's user with the new user defined in the current reqn version
   * 
   * This function will also rest the new user to null in the reqn version if the new_user amendment type is
   * not selected.
   */
  public function change_user()
  {
    $db_reqn_version = $this->get_current_reqn_version();

    // make sure a new-user amendment type was selected
    $amendment_type_mod = lib::create( 'database\modifier' );
    $amendment_type_mod->where( 'new_user', '=', true );
    if( 0 < $db_reqn_version->get_amendment_type_count( $amendment_type_mod ) )
    {
      // change the trainee's supervisor if there is one
      $db_trainee_user = $this->get_trainee_user();
      if( !is_null( $db_trainee_user ) )
      {
        $db_applicant = $db_trainee_user->get_applicant();
        $db_applicant->supervisor_user_id = $db_reqn_version->new_user_id;
        $db_applicant->save();
      }

      // change ownership to the new user
      $this->user_id = $db_reqn_version->new_user_id;
      $this->save();
    }
    else
    {
      // the new user isn't being used, so clear it out
      $db_reqn_version->new_user_id = NULL;
      $db_reqn_version->save();
    }
  }

  /**
   * Generates a zip file containing all agreement letters
   * 
   * @access public
   */
  public function generate_agreements_file()
  {
    $zip_filename = $this->get_filename( 'agreements' );

    $file_list = array();
    foreach( $this->get_reqn_version_object_list() as $db_reqn_version )
    {
      $agreement_filename = $db_reqn_version->get_filename( 'agreement' );
      if( file_exists( $agreement_filename ) )
      {
        $file_list[] = array(
          'path' => $agreement_filename,
          'name' => sprintf( '%s version %s.pdf', $this->identifier, $db_reqn_version->get_amendment_version() )
        );
      }
    }

    if( 0 < count( $file_list ) )
    {
      $zip = new \ZipArchive();
      if( true !== $zip->open( $zip_filename, \ZipArchive::CREATE | \ZipArchive::OVERWRITE ) )
      {
        throw lib::create( 'exception\runtime',
          sprintf(
            'Unable to create zip file "%s" for reqn "%s" agreement letters',
            $zip_filename,
            $this->identifier
          ),
          __METHOD__
        );
      }

      foreach( $file_list as $file ) $zip->addFile( $file['path'], $file['name'] );
      $zip->close();
    }
  }

  /**
   * Generates a text file listing this reqn's reviews
   * 
   * @access public
   */
  public function generate_reviews_file()
  {
    $db_user = $this->get_user();
    $db_trainee_user = $this->get_trainee_user();
    $db_reqn_version = $this->get_current_reqn_version();

    $text = sprintf(
      "Requisition: %s\n".
      "Amendment: %s\n".
      "Title: %s\n".
      "Applicant: %s\n".
      "%s". // trainee only added if one exists
      "Lay Summary:\n".
      "%s\n",
      $this->identifier,
      str_replace( '.', 'no', $db_reqn_version->amendment ),
      $db_reqn_version->title,
      sprintf( '%s %s', $db_user->first_name, $db_user->last_name ),
      is_null( $db_trainee_user ) ?  '' : sprintf( "Trainee: %s %s\n", $db_trainee_user->first_name, $db_trainee_user->last_name ),
      $db_reqn_version->lay_summary
    );

    $review_sel = lib::create( 'database\select' );
    $review_sel->add_column( 'amendment' );
    $review_sel->add_table_column( 'user', 'first_name' );
    $review_sel->add_table_column( 'user', 'last_name' );
    $review_sel->add_column( 'DATE( review.datetime )', 'date', false );
    $review_sel->add_table_column( 'review_type', 'name', 'type' );
    $review_sel->add_table_column( 'recommendation_type', 'name', 'recommendation' );
    $review_sel->add_column( 'note' );

    $review_mod = lib::create( 'database\modifier' );
    $review_mod->left_join( 'user', 'review.user_id', 'user.id' );
    $review_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $review_mod->join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
    $review_mod->order( 'review.datetime' );
    $review_mod->order( 'stage_type_id' );

    // make sure to only get reviews for the current amendment
    $review_mod->join( 'reqn_current_reqn_version', 'review.reqn_id', 'reqn_current_reqn_version.reqn_id' );
    $review_mod->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $review_mod->where( 'review.amendment', '=', 'reqn_version.amendment', false );

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
        str_replace( '.', 'no', $review['amendment'] ),
        is_null( $review['first_name'] ) ? '(none)' : $review['first_name'].' '.$review['last_name'],
        $review['date'],
        is_null( $review['recommendation'] ) ? '(none)' : $review['recommendation'],
        is_null( $review['note'] ) ? '(none)' : $review['note']
      );
    }

    // convert for Windows
    $text = util::convert_charset( str_replace( "\n", "\r\n", $text ) );

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
   * Get the trainee user
   * 
   * @return database\user
   */
  public function get_trainee_user()
  {
    return is_null( $this->trainee_user_id ) ? NULL : lib::create( 'database\user', $this->trainee_user_id );
  }

  /**
   * Get the designate user
   * 
   * @return database\user
   */
  public function get_designate_user()
  {
    return is_null( $this->designate_user_id ) ? NULL : lib::create( 'database\user', $this->designate_user_id );
  }

  /**
   * Refreshes links to all study data files, resets the file-removal countdown timer, and copies supplemental files
   */
  public function refresh_study_data_files()
  {
    $supplemental_file_class_name = lib::get_class_name( 'database\supplemental_file' );
    $setting_manager = lib::create( 'business\setting_manager' );
    $data_path = $this->get_study_data_path( 'data' );
    $web_path = $this->get_study_data_path( 'web' );
    $db_reqn_version = $this->get_current_reqn_version();

    // we might not have a web path at this point, so ignore if we don't
    if( !is_null( $data_path ) && !is_null( $web_path ) )
    {
      // delete all existing links
      util::exec_timeout( sprintf( 'rm -rf %s/*', $web_path ) );

      // by default we'll remove the expiry date (possible set below if a data exists)
      $this->data_expiry_date = NULL;

      // create a relative link to the data files
      $list = glob( $data_path.'/*' );
      if( false !== $list )
      {
        $files_exist = false;
        foreach( $list as $file )
        {
          if( is_file( $file ) )
          {
            $files_exist = true;
            $filename = sprintf( '../../data/%s%s', $this->identifier, str_replace( $data_path, '', $file ) );
            $link = str_replace( $data_path, $web_path, $file );

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

        if( $files_exist )
        {
          // update the data expiry date
          $expiry = util::get_datetime_object();
          $expiry->add( new \DateInterval( sprintf(
            'P%dD', $setting_manager->get_setting( 'general', 'study_data_expiry' )
          ) ) );
          $this->data_expiry_date = $expiry;
        }
      }

      $this->save();

      // add the instructions
      $filename = $this->get_filename( 'instruction' );
      if( is_file( $filename ) )
      {
        $link = sprintf( '%s/%s', $web_path, $this->instruction_filename );
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

    return !is_null( $this->data_expiry_date );
  }

  /**
   * Removes links to study data files when they have expired
   */
  public static function expire_data()
  {
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'data_expiry_date', '<=', util::get_datetime_object() );

    $reqn_list = static::select_objects( $modifier );
    foreach( $reqn_list as $db_reqn )
    {
      // delete all existing links
      $web_path = $db_reqn->get_study_data_path( 'web' );
      if( !is_null( $web_path ) ) util::exec_timeout( sprintf( 'rm -rf %s/*', $web_path ) );

      // remove the expiry date
      $db_reqn->data_expiry_date = NULL;
      $db_reqn->save();
    }

    return count( $reqn_list );
  }

  /**
   * Sends expired ethics approval notifications
   */
  public static function send_expired_ethics_notifications()
  {
    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $db_notification_type = $notification_type_class_name::get_unique_record( 'name', 'Ethics Expiry Notice' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_last_ethics_approval', 'reqn.id', 'reqn_last_ethics_approval.reqn_id' );
    $modifier->join( 'ethics_approval', 'reqn_last_ethics_approval.ethics_approval_id', 'ethics_approval.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'notification.reqn_id', false );
    $join_mod->where( 'notification.notification_type_id', '=', $db_notification_type->id );
    $join_mod->where( 'TIMESTAMPDIFF( DAY, UTC_TIMESTAMP(), notification.datetime )', '=', 0 );
    $modifier->join_modifier( 'notification', $join_mod, 'left' );
    $modifier->where( 'TIMESTAMPDIFF( MONTH, UTC_TIMESTAMP(), ethics_approval.date + INTERVAL 1 DAY )', '=', 1 );
    $modifier->where( 'DAY( ethics_approval.date )', '=', 'DAY( UTC_TIMESTAMP() )', false );
    $modifier->where( 'notification.id', '=', NULL );

    $reqn_list = static::select_objects( $modifier );

    foreach( $reqn_list as $db_reqn )
    {
      $db_notification = lib::create( 'database\notification' );
      $db_notification->notification_type_id = $db_notification_type->id;
      $db_notification->set_reqn( $db_reqn ); // this saves the record
      $db_notification->mail();
    }

    return count( $reqn_list );
  }

  /**
   * Sends expired agreement notifications
   */
  public static function send_expired_agreement_notifications()
  {
    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $db_notification_type = $notification_type_class_name::get_unique_record( 'name', 'Agreement Expiry Notice' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_last_reqn_version_with_agreement', 'reqn.id', 'reqn_last_reqn_version_with_agreement.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_last_reqn_version_with_agreement.reqn_version_id', 'reqn_version.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'notification.reqn_id', false );
    $join_mod->where( 'notification.notification_type_id', '=', $db_notification_type->id );
    $join_mod->where( 'TIMESTAMPDIFF( DAY, UTC_TIMESTAMP(), notification.datetime )', '=', 0 );
    $modifier->join_modifier( 'notification', $join_mod, 'left' );
    $modifier->where( 'TIMESTAMPDIFF( MONTH, UTC_TIMESTAMP(), reqn_version.agreement_end_date + INTERVAL 1 DAY )', '=', 1 );
    $modifier->where( 'DAY( reqn_version.agreement_end_date )', '=', 'DAY( UTC_TIMESTAMP() )', false );
    $modifier->where( 'notification.id', '=', NULL );

    $reqn_list = static::select_objects( $modifier );

    foreach( $reqn_list as $db_reqn )
    {
      $db_notification = lib::create( 'database\notification' );
      $db_notification->notification_type_id = $db_notification_type->id;
      $db_notification->set_reqn( $db_reqn ); // this saves the record
      $db_notification->mail();
    }

    return count( $reqn_list );
  }

  /**
   * Sends expired reqn notifications
   */
  public static function send_expired_reqn_notifications()
  {
    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $setting_manager = lib::create( 'business\setting_manager' );
    $months = $setting_manager->get_setting( 'general', 'unsubmitted_reqn_expiry' );
    $db_notification_type = $notification_type_class_name::get_unique_record( 'name', 'Unsubmitted Application Expiry Notice' );

    // first delete expired reqns
    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_type', 'reqn.reqn_type_id', 'reqn_type.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->where( 'stage_type.name', '=', 'New' );
    $modifier->where( 'reqn.legacy', '=', false );
    $modifier->where( 'reqn_type.name', '=', 'Standard' );
    $modifier->where( sprintf( 'reqn_version.datetime + INTERVAL %d MONTH', $months ), '<=', 'UTC_TIMESTAMP()', false );

    $reqn_list = static::select_objects( $modifier );
    foreach( $reqn_list as $db_reqn )
    {
      $db_user = $db_reqn->get_user();
      log::info( sprintf(
        'Deleting expired requistion "%s" belonging to "%s %s" dated "%s".',
        $db_reqn->identifier,
        $db_user->first_name, $db_user->last_name,
        $db_reqn->get_current_reqn_version()->datetime->format( 'Y-m-d' )
      ) );
      $db_current_stage = $db_reqn->get_current_stage();
      $db_current_stage->delete();
      $db_reqn->delete();
    }

    // next send a notification for reqns with an expiry one month away
    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_type', 'reqn.reqn_type_id', 'reqn_type.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.datetime', '=', NULL );
    $modifier->join_modifier( 'stage', $join_mod );
    $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'notification.reqn_id', false );
    $join_mod->where( 'notification.notification_type_id', '=', $db_notification_type->id );
    $join_mod->where( 'notification.datetime + INTERVAL 2 MONTH', '>=', 'UTC_TIMESTAMP()', false ); // use 2 months as a buffer
    $modifier->join_modifier( 'notification', $join_mod, 'left' );
    $modifier->where( 'stage_type.name', '=', 'New' );
    $modifier->where( 'reqn.legacy', '=', false );
    $modifier->where( 'reqn_type.name', '=', 'Standard' );
    $modifier->where( sprintf( 'reqn_version.datetime + INTERVAL %d MONTH', $months - 1 ), '<=', 'UTC_TIMESTAMP()', false );
    $modifier->where( 'notification.id', '=', NULL );

    $reqn_list = static::select_objects( $modifier );
    foreach( $reqn_list as $db_reqn )
    {
      $db_notification = lib::create( 'database\notification' );
      $db_notification->notification_type_id = $db_notification_type->id;
      $db_notification->set_reqn( $db_reqn ); // this saves the record
      $db_notification->mail();
    }

    return count( $reqn_list );
  }

  /**
   * Marks all notices viewed by the given user
   * @param string $type One of primary, trainee or designate
   */
  public function mark_notices_as_read( $type = 'primary' )
  {
    // get the notice list
    $notice_sel = lib::create( 'database\select' );
    $notice_sel->add_column( 'id' );
    $notice_id_list = array();
    foreach( $this->get_notice_list( $notice_sel ) as $notice ) $notice_id_list[] = $notice['id'];

    if( 0 < count( $notice_id_list ) )
    {
      $db_user = NULL;
      if( 'primary' == $type ) $db_user = $this->get_user();
      else if( 'trainee' == $type ) $db_user = $this->get_trainee_user();
      else if( 'designate' == $type ) $db_user = $this->get_designate_user();

      if( !is_null( $db_user ) ) $db_user->add_notice( $notice_id_list );
    }
  }

  /**
   * Returns the requisition's study-data paths
   * 
   * @param string $type One of "data" or "web"
   * @return string
   */
  private function get_study_data_path( $type )
  {
    if( !in_array( $type, array( 'data', 'web' ) ) ) throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );

    // the web path may not exist, return NULL if it doesn't
    $path_postfix = 'data' == $type ? $this->identifier : $this->data_directory;
    return is_null( $path_postfix ) ?
      NULL :
      sprintf(
        '%s/%s/%s',
        STUDY_DATA_PATH,
        $type,
        'data' == $type ? $this->identifier : $this->data_directory
      );
  }

  /**
   * Creates a unique directory for study data and returns the directory name
   * 
   * @access private
   */
  private function generate_data_directory()
  {
    if( is_null( $this->data_directory ) )
    {
      $created = false;
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

        // create the web directory based on the random name
        $path = sprintf( '%s/web/%s', STUDY_DATA_PATH, $name );
        if( !file_exists( $path ) )
        {
          if( !mkdir( $path ) )
            throw lib::create( 'exception\runtime', sprintf( 'Unable to create data directory "%s"', $path ), __METHOD__ );

          // now create the data directory based on the identifier
          $path = sprintf( '%s/data/%s', STUDY_DATA_PATH, $this->identifier );
          if( !file_exists( $path ) )
          {
            if( !mkdir( $path ) )
              throw lib::create( 'exception\runtime', sprintf( 'Unable to create data directory "%s"', $path ), __METHOD__ );
            chmod( $path, 0777 );
          }

          $this->data_directory = $name;
          $this->save();

          $created = true;
          break;
        }
      }

      // if we get here then something is wrong
      if( !$created ) throw lib::create( 'exception\runtime', 'Unable to create unique data directory.', __METHOD__ );
    }
  }

  /**
   * Check the reqn's deadline and change it to the next available deadline if needed
   * 
   * This is only done for reqn types which go through the DSAC review process
   * NOTE: This method will change the deadline_id column but not save the record
   * @access private
   */
  private function assert_deadline()
  {
    $deadline_class_name = lib::get_class_name( 'database\deadline' );

    $db_reqn_type = lib::create( 'database\reqn_type', $this->reqn_type_id );
    if( !$this->legacy && $db_reqn_type->is_deadline_required() )
    {
      $db_deadline = NULL;
      $change_deadline = false;
      if( is_null( $this->deadline_id ) )
      { // no deadline found
        $db_deadline = $deadline_class_name::get_next();
        $change_deadline = true;
      }
      else
      {
        $number_of_stages = 0;
        if( !is_null( $this->id ) )
        {
          $stage_mod = lib::create( 'database\modifier' );
          $stage_mod->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
          $number_of_stages = $this->get_stage_count( $stage_mod );
        }

        // if there are zero or one stages then this is a new requisition which needs its deadline set
        if( 2 > $number_of_stages )
        {
          if( 0 < $this->get_deadline()->datetime->diff( util::get_datetime_object() )->days )
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
  }

  /**
   * Applies the search term to the modifier (searches all text elements in the reqn)
   * 
   * @param string $search
   * @param database\modifier $modifier
   */
  public static function apply_search_term( $search, &$modifier )
  {
    // join to all tables included in the search
    if( !$modifier->has_join( 'user' ) )
      $modifier->join( 'user', 'reqn.user_id', 'user.id' );
    if( !$modifier->has_join( 'trainee_user' ) )
      $modifier->left_join( 'user', 'reqn.trainee_user_id', 'trainee_user.id', 'trainee_user' );
    if( !$modifier->has_join( 'designate_user' ) )
      $modifier->left_join( 'user', 'reqn.designate_user_id', 'designate_user.id', 'designate_user' );
    if( !$modifier->has_join( 'reqn_version' ) )
    {
      $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
      $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    }
    if( !$modifier->has_join( 'applicant_country' ) )
      $modifier->left_join( 'country', 'reqn_version.applicant_country_id', 'applicant_country.id', 'applicant_country' );
    if( !$modifier->has_join( 'trainee_country' ) )
      $modifier->left_join( 'country', 'reqn_version.trainee_country_id', 'trainee_country.id', 'trainee_country' );
    if( !$modifier->has_join( 'coapplicant' ) )
    {
      $modifier->left_join( 'coapplicant', 'reqn_version.id', 'coapplicant.reqn_version_id' );
      $modifier->group( 'reqn.id' );
    }

    // convert the search term to an RLIKE search term with word boundaries
    $search = sprintf( '[[:<:]]%s[[:>:]]', $search );
    $modifier->where_bracket( true );

    // applicant
    $modifier->where( 'user.name', 'RLIKE', $search );
    $modifier->or_where( 'user.first_name', 'RLIKE', $search );
    $modifier->or_where( 'user.last_name', 'RLIKE', $search );
    $modifier->or_where( 'CONCAT( user.first_name, " ", user.last_name )', 'RLIKE', $search );

    // trainee
    $modifier->or_where( 'trainee_user.name', 'RLIKE', $search );
    $modifier->or_where( 'trainee_user.first_name', 'RLIKE', $search );
    $modifier->or_where( 'trainee_user.last_name', 'RLIKE', $search );
    $modifier->or_where( 'CONCAT( trainee_user.first_name, " ", trainee_user.last_name )', 'RLIKE', $search );

    // designate
    $modifier->or_where( 'designate_user.name', 'RLIKE', $search );
    $modifier->or_where( 'designate_user.first_name', 'RLIKE', $search );
    $modifier->or_where( 'designate_user.last_name', 'RLIKE', $search );
    $modifier->or_where( 'CONCAT( designate_user.first_name, " ", designate_user.last_name )', 'RLIKE', $search );

    // applicant details
    $modifier->or_where( 'reqn_version.applicant_position', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.applicant_affiliation', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.applicant_address', 'RLIKE', $search );
    $modifier->or_where( 'applicant_country.name', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.applicant_phone', 'RLIKE', $search );

    // trainee details
    $modifier->or_where( 'reqn_version.trainee_program', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.trainee_institution', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.trainee_address', 'RLIKE', $search );
    $modifier->or_where( 'trainee_country.name', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.trainee_phone', 'RLIKE', $search );

    // text elements
    $modifier->or_where( 'reqn_version.title', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.keywords', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.lay_summary', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.background', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.objectives', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.methodology', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.analysis', 'RLIKE', $search );
    $modifier->or_where( 'reqn_version.grant_number', 'RLIKE', $search );

    // coapplicant
    $modifier->or_where( 'coapplicant.name', 'RLIKE', $search );
    $modifier->or_where( 'coapplicant.position', 'RLIKE', $search );
    $modifier->or_where( 'coapplicant.affiliation', 'RLIKE', $search );
    $modifier->or_where( 'coapplicant.email', 'RLIKE', $search );
    $modifier->or_where( 'coapplicant.role', 'RLIKE', $search );

    $modifier->where_bracket( false );
  }
}
